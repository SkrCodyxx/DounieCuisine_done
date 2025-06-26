#!/bin/bash
# SCRIPT DE DÉPLOIEMENT KUBERNETES - DOUNIE CUISINE
# Déploiement complet sur cluster Kubernetes

set -e

echo "🚀 DÉMARRAGE DÉPLOIEMENT DOUNIE CUISINE SUR KUBERNETES"

# Variables
NAMESPACE="dounie-cuisine"
APP_NAME="dounie-cuisine"

# Fonction de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Vérification kubectl
if ! command -v kubectl &> /dev/null; then
    log "❌ kubectl n'est pas installé"
    exit 1
fi

# 1. Création du namespace
log "Création du namespace..."
kubectl apply -f namespace.yaml

# 2. Configuration secrets et configmaps
log "Application des configurations..."
kubectl apply -f secret.yaml -n $NAMESPACE
kubectl apply -f configmap.yaml -n $NAMESPACE

# 3. Déploiement du stockage persistant
log "Configuration du stockage..."
kubectl apply -f storage.yaml -n $NAMESPACE

# 4. Déploiement PostgreSQL
log "Déploiement de la base de données..."
kubectl apply -f postgres-deployment.yaml -n $NAMESPACE

# Attente que PostgreSQL soit prêt
log "Attente du démarrage de PostgreSQL..."
kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s

# 5. Déploiement de l'application
log "Déploiement de l'application..."
kubectl apply -f app-deployment.yaml -n $NAMESPACE

# Attente que l'application soit prête
log "Attente du démarrage de l'application..."
kubectl wait --for=condition=ready pod -l app=$APP_NAME -n $NAMESPACE --timeout=300s

# 6. Déploiement Nginx (reverse proxy)
log "Déploiement du reverse proxy..."
kubectl apply -f nginx-deployment.yaml -n $NAMESPACE

# Attente que Nginx soit prêt
log "Attente du démarrage de Nginx..."
kubectl wait --for=condition=ready pod -l app=nginx -n $NAMESPACE --timeout=300s

# 7. Vérification du déploiement
log "Vérification du déploiement..."

# Status des pods
kubectl get pods -n $NAMESPACE

# Status des services
kubectl get services -n $NAMESPACE

# Test de santé de l'API
CLUSTER_IP=$(kubectl get service ${APP_NAME}-service -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
if kubectl run --rm -i --tty test-pod --image=curlimages/curl --restart=Never -n $NAMESPACE -- curl -f http://$CLUSTER_IP:8001/api/health; then
    log "✅ Test de santé API réussi"
else
    log "⚠️ Test de santé API échoué - vérifiez les logs"
fi

# 8. Informations d'accès
log "🎉 DÉPLOIEMENT KUBERNETES TERMINÉ!"

echo ""
echo "=== INFORMATIONS D'ACCÈS ==="
echo "Namespace: $NAMESPACE"
echo "Pods:"
kubectl get pods -n $NAMESPACE

echo ""
echo "Services:"
kubectl get services -n $NAMESPACE

echo ""
echo "=== COMMANDES UTILES ==="
echo "Voir les pods: kubectl get pods -n $NAMESPACE"
echo "Logs backend: kubectl logs -f deployment/$APP_NAME -n $NAMESPACE"
echo "Logs nginx: kubectl logs -f deployment/nginx -n $NAMESPACE"
echo "Shell dans pod: kubectl exec -it deployment/$APP_NAME -n $NAMESPACE -- /bin/bash"
echo "Port forward: kubectl port-forward service/nginx-service 8080:80 -n $NAMESPACE"
echo "================================="