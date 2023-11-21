# MyCampusMap - React Native app
Application de visualisation d'une map, centrée sur Technolac, permettant de laisser des avis sur des bâtiments du campus ou créer de nouveaux points d'intérêts.

## Qualités VS Défauts
React Native a les défauts de ses qualités
+ bcp de lib => énorme facilité pour afficher une map, la navigation de l'app, les icônes etc.
- peu de fonctionnalités pour React Native vanilla => très vite obligé de faire des npm install : exemple du picker pour le type de bâtiment dans le modal.

## Librairies installées
Avec la commande `npm install`

Côté client :
- `@react-navigation/native` pour la navigation dans l'app
- `@react-navigation/bottom-tabs` pour la barre du bas, navigation entre fragments
- `react-native-maps` pour l'affichage d'une carte et la gestion des marqueurs
- `@react-native-async-storage/async-storage` pour le stockage local en préférences partagées (clé-valeur`[string` ou `JSON.stringify(jsonObject)]`)
- `react-native-paper` pour une application au design natif de Google
- `@react-native-picker/picker` component picker
- `axios` pour faciliter certaine requêtes vers le serveur

Côté serveur :
- `express` pour la gestion des routes
- `sqlite3` pour la base de données
- `ngrok` pour simuler un serveur en ligne à partir d'un serveur en local