# 🔥 Configuration Firebase - Utiliser Firestore au lieu de Realtime Database

## ⚠️ PROBLÈME IDENTIFIÉ
Vous utilisez actuellement **Realtime Database** mais le code de l'application est configuré pour **Firestore**. Il faut basculer vers Firestore.

## 🚀 SOLUTION : Configurer Firestore

### Étape 1 : Activer Firestore dans Firebase Console

1. **Allez dans votre projet Firebase** : https://console.firebase.google.com/
2. **Dans le menu de gauche, cliquez sur "Firestore Database"** (pas "Realtime Database")
3. **Cliquez sur "Créer une base de données"**
4. **Choisissez le mode** :
   - **Mode test** (pour le développement) - recommandé pour commencer
   - **Mode production** (si vous voulez des règles strictes dès le début)
5. **Sélectionnez une région** : `europe-west1` (Europe) ou `us-central1` (USA)
6. **Cliquez sur "Terminé"**

### Étape 2 : Configurer les règles Firestore

Une fois Firestore créé, vous verrez un onglet **"Règles"** dans Firestore Database.

**Remplacez le contenu par :**

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
      allow create: if true;
      allow read, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les produits
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les articles de blog
    match /blog_posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les vidéos
    match /videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Étape 3 : Vérifier la configuration Firebase

Assurez-vous que votre fichier `.env` contient bien :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

### Étape 4 : Tester la configuration

1. **Redémarrez votre serveur de développement**
2. **Allez sur `/admin/setup`** dans votre application
3. **Lancez la configuration automatique**

## 🔍 DIFFÉRENCES IMPORTANTES

| Realtime Database | Firestore |
|-------------------|-----------|
| Structure JSON simple | Documents et collections |
| Règles `.read` et `.write` | Règles `allow read, write` |
| Temps réel par défaut | Temps réel optionnel |
| Moins de fonctionnalités | Plus de fonctionnalités |

## ✅ POURQUOI FIRESTORE ?

- **Plus moderne** et recommandé par Google
- **Meilleure performance** pour les applications complexes
- **Requêtes plus puissantes**
- **Meilleure sécurité** avec des règles plus flexibles
- **Support TypeScript** natif

## 🆘 SI VOUS VOULEZ GARDER REALTIME DATABASE

Si vous préférez garder Realtime Database, il faudrait réécrire tout le code de l'application, ce qui représente beaucoup de travail. Je recommande fortement de passer à Firestore.

## 📞 BESOIN D'AIDE ?

Si vous avez des difficultés avec cette configuration, n'hésitez pas à demander de l'aide !