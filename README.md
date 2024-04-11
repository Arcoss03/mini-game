# mini-game-ia

## [API documentation link](./api/README.md)
## [Front end documentation link](./front/README.md)

## using docker compose tu run database + adminer:
be sure to have .env in **./api**

up docker compose
```bash
docker compose up -d
```
down docker compose
```bash
docker compose down
```
make database backup: 
```bash
./scripts/backup.sh 
```


## use vps:
- the mysql database is running on a vps
- nginx docker container is running on the vps
- front end and api are running on the same docker container

to access to the mysql console:
```bash
mysql -u root -p
```