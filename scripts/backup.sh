#!/bin/bash

# Configuration
CONTAINER_NAME=poc-mini-game-ia-db-1 # Nom de votre conteneur MySQL
DB_NAME=poc_db              # Nom de votre base de données
DB_USER=root                      # Utilisateur de la base de données
DB_PASS=root               # Mot de passe de l'utilisateur
BACKUP_PATH=./database/backups # Chemin où les sauvegardes doivent être stockées sur l'hôte

# Création d'une sauvegarde
docker exec $CONTAINER_NAME mysqldump -u $DB_USER --password=$DB_PASS $DB_NAME > "$BACKUP_PATH/db_backup_$(date +%Y-%m-%d_%H-%M-%S).sql"

# Optionnel : Ajoutez ici une logique pour supprimer les anciennes sauvegardes si nécessaire
