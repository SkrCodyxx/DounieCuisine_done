#!/bin/bash

# Script de déploiement Kubernetes pour Dounie Cuisine
# Usage: ./deploy-k8s.sh [cluster-type]
# cluster-type: k8s (kubernetes standard) ou k3s (k3s lightweight)

set -e

CLUSTER_TYPE=${1:-"k8s"}
NAMESPACE="dounie-cuisine"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl n'est pas installé"
        exit 1
    fi
    
    # Vérifier la connexion au cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Impossible de se connecter au cluster Kubernetes"
        exit 1
    fi
    
    # Vérifier Docker (pour build des images)
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Installation du cluster selon le type
setup_cluster() {
    log_info "Configuration du cluster $CLUSTER_TYPE..."
    
    if [[ "$CLUSTER_TYPE" == "k3s" ]]; then
        setup_k3s
    else
        setup_k8s
    fi
}

# Installation K3s
setup_k3s() {
    log_info "Installation de K3s..."
    
    if ! command -v k3s &> /dev/null; then
        curl -sfL https://get.k3s.io | sh -
        
        # Configuration de kubectl pour k3s
        mkdir -p ~/.kube
        sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
        sudo chown $(id -u):$(id -g) ~/.kube/config
        
        log_success "K3s installé avec succès"
    else
        log_success "K3s déjà installé"
    fi
}

# Vérification/Installation Kubernetes standard
setup_k8s() {
    log_info "Vérification de l'installation Kubernetes..."
    
    # Vérifier si le cluster est accessible
    if kubectl cluster-info &> /dev/null; then
        log_success "Cluster Kubernetes accessible"
    else
        log_error "Cluster Kubernetes non accessible. Veuillez configurer votre cluster."
        exit 1
    fi
}

# Build des images Docker
build_images() {
    log_info "Construction des images Docker..."
    
    # Build de l'image principale
    docker build -t dounie-cuisine:latest -f docker-deployment/Dockerfile .
    
    # Si on utilise un registry local (k3s), on peut importer directement
    if [[ "$CLUSTER_TYPE" == "k3s" ]]; then
        docker save dounie-cuisine:latest | sudo k3s ctr images import -
    fi
    
    log_success "Images construites"
}

# Génération des secrets sécurisés
generate_secrets() {
    log_info "Génération des secrets sécurisés..."
    
    # Générer des mots de passe aléatoires
    DB_PASSWORD=$(openssl rand -base64 32)
    SESSION_SECRET=$(openssl rand -base64 64)
    JWT_SECRET=$(openssl rand -base64 32)
    
    # Créer le fichier secret avec les vraies valeurs
    cat > /tmp/dounie-secrets.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: dounie-secrets
  namespace: $NAMESPACE
type: Opaque
stringData:
  DATABASE_URL: "postgresql://dounie_user:$DB_PASSWORD@dounie-postgres:5432/dounie_cuisine"
  DB_PASSWORD: "$DB_PASSWORD"
  SESSION_SECRET: "$SESSION_SECRET"
  JWT_SECRET: "$JWT_SECRET"
EOF
    
    log_success "Secrets générés"
}

# Déploiement des composants
deploy_components() {
    log_info "Déploiement des composants Kubernetes..."
    
    # Créer le namespace
    kubectl apply -f namespace.yaml
    
    # Créer les volumes persistants
    kubectl apply -f storage.yaml
    
    # Appliquer les secrets
    kubectl apply -f /tmp/dounie-secrets.yaml
    
    # Appliquer la configuration
    kubectl apply -f configmap.yaml
    
    # Déployer PostgreSQL
    kubectl apply -f postgres-deployment.yaml
    
    # Attendre que PostgreSQL soit prêt
    log_info "Attente du démarrage de PostgreSQL..."
    kubectl wait --for=condition=available --timeout=300s deployment/dounie-postgres -n $NAMESPACE
    
    # Déployer l'application
    kubectl apply -f app-deployment.yaml
    
    # Attendre que l'application soit prête
    log_info "Attente du démarrage de l'application..."
    kubectl wait --for=condition=available --timeout=300s deployment/dounie-app -n $NAMESPACE
    
    # Déployer Nginx
    kubectl apply -f nginx-deployment.yaml
    
    # Attendre que Nginx soit prêt
    kubectl wait --for=condition=available --timeout=300s deployment/dounie-nginx -n $NAMESPACE
    
    # Nettoyer le fichier secret temporaire
    rm -f /tmp/dounie-secrets.yaml
    
    log_success "Composants déployés"
}

# Configuration post-déploiement
post_deployment_setup() {
    log_info "Configuration post-déploiement..."
    
    # Attendre que tous les pods soient en cours d'exécution
    log_info "Attente de la stabilisation des pods..."
    sleep 30
    
    # Vérifier l'état des déploiements
    kubectl get deployments -n $NAMESPACE
    kubectl get pods -n $NAMESPACE
    kubectl get services -n $NAMESPACE
    
    log_success "Configuration post-déploiement terminée"
}

# Affichage des informations d'accès
show_access_info() {
    echo ""
    log_success "🎉 Déploiement Kubernetes de Dounie Cuisine terminé!"
    echo ""
    
    # Récupérer l'IP externe
    EXTERNAL_IP=""
    if [[ "$CLUSTER_TYPE" == "k3s" ]]; then
        EXTERNAL_IP=$(hostname -I | awk '{print $1}')
    else
        EXTERNAL_IP=$(kubectl get service dounie-nginx-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "En attente...")
    fi
    
    log_info "🌐 URLs d'accès:"
    log_info "   Site Public:        http://$EXTERNAL_IP"
    log_info "   Administration:     http://$EXTERNAL_IP/admin"
    log_info "   API:                http://$EXTERNAL_IP/api"
    echo ""
    
    log_info "📋 Commandes utiles:"
    log_info "   Pods:               kubectl get pods -n $NAMESPACE"
    log_info "   Services:           kubectl get services -n $NAMESPACE"
    log_info "   Logs API:           kubectl logs -l app=dounie-app -n $NAMESPACE"
    log_info "   Accès shell:        kubectl exec -it deployment/dounie-app -n $NAMESPACE -- /bin/sh"
    echo ""
    
    log_info "🔧 Gestion:"
    log_info "   Redémarrer app:     kubectl rollout restart deployment/dounie-app -n $NAMESPACE"
    log_info "   Scaler:             kubectl scale deployment/dounie-app --replicas=5 -n $NAMESPACE"
    log_info "   Supprimer:          kubectl delete namespace $NAMESPACE"
    echo ""
}

# Fonction principale
main() {
    echo "🚀 Déploiement Kubernetes Dounie Cuisine ($CLUSTER_TYPE)"
    echo "=================================================="
    
    check_prerequisites
    setup_cluster
    build_images
    generate_secrets
    deploy_components
    post_deployment_setup
    show_access_info
}

# Gestion d'erreur
trap 'log_error "Erreur de déploiement. Vérifiez les logs Kubernetes."; exit 1' ERR

# Exécution
main "$@"