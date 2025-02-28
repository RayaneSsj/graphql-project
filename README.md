Ce projet est un réseau social développé avec GraphQL, Apollo Server, Prisma pour le backend, et React avec Apollo Client pour le frontend. Le projet utilise TypeScript strict sans aucun type any ni de conversions forcées. Les fonctionnalités incluent l'authentification JWT, la gestion des articles, des commentaires, et des likes.

Technologies Utilisées
Backend :

GraphQL avec Apollo Server
Prisma pour l'ORM
TypeScript strict
Authentification JWT
Frontend :

React avec Vite
Apollo Client
TypeScript strict
Installation et Lancement du Projet
Prérequis
Node.js et Yarn doivent être installés sur votre machine.
Si Yarn n'est pas installé, utilisez la commande suivante pour l'installer :
npm install -g yarn
Le back-end est fonctionnel (authentification, ajout d'article, like, commentaires etc...) On peut delete un article dans le back, par contre dans le front on a oublié de l'implémenter et par manque de temps. En revanche au niveau du front-end on a eu quelques soucis de typage, il est possible que certaines fonctionnalitées ne soient pas disponible. Aussi, quand on like ou que l'on ajoute un commentaire, il faut rafraîchir la page.
