# Service Gateway

Le service Gateway sert de point d'entrée pour les différentes requêtes qui arrivent dans l'application. Il agit comme un proxy inverse qui dirige les requêtes vers les différents microservices du backend. Il est configuré avec Docker et Node.js.

## Fichiers et répertoires importants

- **Dockerfile** : Fichier de configuration Docker pour créer l'image du service Gateway.
- **package.json** : Gère les dépendances du projet Node.js.
- **server.js** : Le serveur Node.js qui gère les requêtes entrantes et les redirige vers les services appropriés.
