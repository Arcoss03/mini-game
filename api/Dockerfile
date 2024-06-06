# Utiliser une image Node.js LTS (Long Term Support) basée sur Alpine
FROM node:lts-alpine as build-stage

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances du projet
RUN npm ci

# Copier le reste des fichiers du projet
COPY . .

# Compiler le projet
RUN npm run build

# Exposer le port sur lequel l'API sera accessible
EXPOSE 3000

# Définir la commande pour démarrer l'API
CMD ["node", "src/server.js"]