# ArnaudStutz_6_16122020
Repository backend projet 6 développeur web OpenClassrooms

Repo du projet 6 , j'ai volontairement écarté les node_modules de git à cause du poids de la bibliotheque. Les modules nécessaires ont étés sauvegardés dans le packagelock.json. 

Installation et lancement du server:

- cloner le projet
- ouvrir la console dans le dossier créé (ou déplacer vous dans le dossier cd nom_dossier)
- lancer la commande npm install (installation des dépedences)
- renommer le fichier ".env.example" en => ".env"
- ouvrir le fichier .env et remplacer les champs "....." par les informations requises { APP_PORT(Choisir un port pour le server), DB_USER(Validateur) et DB_PASSWORD(ProjectValidation), DB_CLUSTER(clusteroc.pjhhv.mongodb.net/ClusterOC) }
- lancer le server avec la commande npm start

- le server se lance et la console affiche : Connexion à MongoDB réussie ! Server on port {numero du APP_PORT choisi dans le fichier .env)


Installation et lancement Application/frontend:
La partie apllication/frontend se trouve ici: https://github.com/OpenClassrooms-Student-Center/dwj-projet6

- cloner le projet
- ouvrir la console dans le dossier installé (ou déplacer vous dans le dossier cd nom_dossier)
- lancer la commande npm install (installation des dépedences)
- pour faire fonctionner le projet, vous devez installer node-sass à part.
- lancer la commande npm start  / ou:  ng serve
- attendre la fin de la compilation et ouvrir le navigateur web à l'adresse : http://localhost:4200/
