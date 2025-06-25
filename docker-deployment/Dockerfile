# Dockerfile multi-stage pour Dounie Cuisine
# Image de production optimisée avec Node.js 20

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Installer les dépendances système
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Créer le répertoire de travail
WORKDIR /build

# Copier les fichiers de configuration
COPY package*.json ./
COPY api/package*.json ./api/
COPY public/package*.json ./public/
COPY administration/package*.json ./administration/

# Installer les dépendances
RUN npm ci --only=production && \
    cd api && npm ci --only=production && \
    cd ../public && npm ci && \
    cd ../administration && npm ci

# Copier le code source
COPY . .

# Build des applications
RUN cd api && npm run build && \
    cd ../public && npm run build && \
    cd ../administration && npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Installer les dépendances système pour la production
RUN apk add --no-cache \
    postgresql-client \
    curl \
    dumb-init

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S dounie && \
    adduser -S dounie -u 1001

# Créer les répertoires nécessaires
RUN mkdir -p /app/logs /app/backups && \
    chown -R dounie:dounie /app

# Définir le répertoire de travail
WORKDIR /app

# Copier les artefacts de build depuis le stage builder
COPY --from=builder --chown=dounie:dounie /build/api/dist ./api/dist
COPY --from=builder --chown=dounie:dounie /build/api/node_modules ./api/node_modules
COPY --from=builder --chown=dounie:dounie /build/api/package.json ./api/
COPY --from=builder --chown=dounie:dounie /build/public/dist ./public/dist
COPY --from=builder --chown=dounie:dounie /build/administration/dist ./administration/dist

# Copier les fichiers de configuration
COPY --chown=dounie:dounie ecosystem.config.js ./
COPY --chown=dounie:dounie docker-deployment/docker-entrypoint.sh ./
COPY --chown=dounie:dounie docker-deployment/health-check.sh ./

# Rendre les scripts exécutables
RUN chmod +x docker-entrypoint.sh health-check.sh

# Exposer les ports
EXPOSE 5000 3000 3001

# Configuration des variables d'environnement par défaut
ENV NODE_ENV=production \
    API_PORT=5000 \
    PUBLIC_PORT=3000 \
    ADMIN_PORT=3001 \
    MESSAGING_ENABLED=true \
    MONITORING_ENABLED=true

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ./health-check.sh

# Utiliser l'utilisateur non-root
USER dounie

# Point d'entrée avec dumb-init pour une gestion propre des signaux
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]