
# Ascendia

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
