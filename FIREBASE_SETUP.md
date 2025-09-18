# Configuration Firebase pour BBP Performance

## 🔥 Étapes de configuration Firebase

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: "bbp-performance")
4. Activez Google Analytics (optionnel)
5. Créez le projet

### 2. Configurer l'application Web

1. Dans votre projet Firebase, cliquez sur l'icône Web `</>`
2. Nommez votre app (ex: "BBP Performance Web")
3. Cochez "Configurer Firebase Hosting" (optionnel)
4. Cliquez sur "Enregistrer l'app"
5. **Copiez la configuration** qui s'affiche

### 3. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-projet-id
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Emails de contact
VITE_CONTACT_EMAIL=contact@bambaperformance.com
VITE_ADMIN_EMAIL=admin@bambaperformance.com
```

### 4. Configurer Firestore Database

1. Dans Firebase Console, allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Commencer en mode test" (pour le développement)
4. Sélectionnez une région (ex: europe-west1)

### 5. Configurer Authentication

1. Allez dans "Authentication" > "Sign-in method"
2. Activez "Email/Password"
3. Désactivez "Email link (passwordless sign-in)" si activé

### 6. Configurer les règles de sécurité Firestore

Dans "Firestore Database" > "Règles", remplacez par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les réservations
    match /bookings/{bookingId} {
      allow create: if true; // Permet aux utilisateurs anonymes de créer des réservations
      allow read, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les produits
    match /products/{productId} {
      allow read: if true; // Lecture publique
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les articles de blog
    match /blog_posts/{postId} {
      allow read: if true; // Lecture publique
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les vidéos
    match /videos/{videoId} {
      allow read: if true; // Lecture publique
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les commandes
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 7. Créer un utilisateur administrateur

1. Allez dans "Authentication" > "Users"
2. Cliquez sur "Ajouter un utilisateur"
3. Email: `admin@bambaperformance.com`
4. Mot de passe: `!*$Root-1!*$`
5. Cliquez sur "Ajouter un utilisateur"

### 8. Ajouter le rôle admin dans Firestore

1. Allez dans "Firestore Database"
2. Créez une collection `users`
3. Créez un document avec l'ID de l'utilisateur admin créé
4. Ajoutez les champs :
   ```
   email: "admin@bambaperformance.com"
   role: "admin"
   full_name: "Administrateur BBP"
   created_at: [timestamp actuel]
   ```

### 9. Tester la configuration

1. Redémarrez le serveur de développement : `npm run dev`
2. Vérifiez la console du navigateur pour les messages de Firebase
3. Testez la connexion admin à `/login`
4. Testez la création d'une réservation

### 10. Collections Firestore nécessaires

Le site utilise ces collections :
- `users` : Utilisateurs et administrateurs
- `bookings` : Réservations de séances
- `products` : Produits de la boutique
- `blog_posts` : Articles de blog
- `videos` : Vidéos de formation
- `orders` : Commandes clients

### 🚨 Important

- **Sécurité** : En production, changez les règles Firestore pour être plus restrictives
- **Sauvegarde** : Configurez des sauvegardes automatiques
- **Monitoring** : Activez les alertes Firebase pour surveiller l'utilisation

### ✅ Vérification

Une fois configuré, vous devriez voir dans la console :
```
✅ Firebase initialisé avec succès
```

Si vous voyez des erreurs, vérifiez que toutes les variables d'environnement sont correctement définies.