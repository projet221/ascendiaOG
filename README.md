
# AscendiaOG

Ce projet est une application composée de deux grandes parties : un **frontend** développé en React.js et un **backend** utilisant des microservices. L'objectif de ce projet est d'offrir un outil moderne pour la gestion automatisée des publications sur les réseaux sociaux.

## Arborescence du projet

Voici la structure du projet :

- **[frontend/](./frontend)** : L'application React.js pour l'interface utilisateur.
  - **[reactJS/](./frontend/reactJS)** : Dossier contenant le code de l'application React.
  
- **[backend/](./backend)** : Le backend de l'application avec des services et une configuration Docker.
  - **[Gateway/](./backend/gateway)** : Dossier contenant le point d'entrée du backend.
  - **[services/](./backend/services)** : Dossier contenant les différents microservices.
    - **[posts/](./backend/services/posts)** : Service de gestion des publications.
    - **[socialAuth/](./backend/services/socialAuth)** : Service d'authentification sociale.
    - **[users/](./backend/services/users)** : Service de gestion des utilisateurs.

## Installation

### Prérequis

- Deployer en ligne
- créé des applications développeurs sur Meta et Twitter.

### Pour démarrer le frontend

1. Clonez le projet :
   ```bash
   git clone <URL du projet>
   cd ascendiaOG-main/frontend/reactJS
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez l'application :
   ```bash
   npm run dev
   ```

### Pour démarrer le backend

1. Clonez le projet et accédez au répertoire backend :
   ```bash
   cd ascendiaOG-main/backend
   ```

2. Utilisez Docker pour démarrer les services :
   ```bash
   docker-compose up
   ```
    
