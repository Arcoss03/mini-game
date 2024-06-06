# Utiliser une image Node.js LTS (Long Term Support) basée sur Alpine
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]