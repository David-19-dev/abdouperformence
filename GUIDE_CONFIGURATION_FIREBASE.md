# 🔥 Guide Complet de Configuration Firebase pour BBP Performance

## 📋 **ÉTAPES À SUIVRE DANS L'ORDRE**

### 🎯 **ÉTAPE 1 : Activer Firestore Database**

1. **Allez sur Firebase Console** : https://console.firebase.google.com/
2. **Sélectionnez votre projet** "BBP Performance"
3. **Dans le menu de gauche, cliquez sur "Firestore Database"** (PAS "Realtime Database")
4. **Cliquez sur "Créer une base de données"**
5. **Choisissez "Commencer en mode test"** (pour le développement)
6. **Sélectionnez une région** : `europe-west1` (Europe) ou `us-central1` (USA)
7. **Cliquez sur "Terminé"**

### 🔐 **ÉTAPE 2 : Activer Authentication**

1. **Dans le menu de gauche, cliquez sur "Authentication"**
2. **Cliquez sur "Get started"** si c'est la première fois
3. **Allez dans l'onglet "Sign-in method"**
4. **Cliquez sur "Email/Password"**
5. **Activez "Email/Password"** (première option)
6. **Désactivez "Email link"** (deuxième option)
7. **Cliquez sur "Save"**

### 👤 **ÉTAPE 3 : Créer l'utilisateur administrateur**

1. **Restez dans "Authentication"**
2. **Cliquez sur l'onglet "Users"**
3. **Cliquez sur "Add user"**
4. **Remplissez :**
   - **Email** : `admin@bambaperformance.com`
   - **Password** : `!*$Root-1!*$`
5. **Cliquez sur "Add user"**
6. **NOTEZ L'UID** de l'utilisateur créé (vous en aurez besoin)

### 📝 **ÉTAPE 4 : Créer le profil admin dans Firestore**

1. **Allez dans "Firestore Database"**
2. **Cliquez sur "Start collection"**
3. **Collection ID** : `users`
4. **Document ID** : Collez l'UID de l'utilisateur créé à l'étape 3
5. **Ajoutez ces champs :**
   ```
   email: admin@bambaperformance.com (string)
   role: admin (string)
   full_name: Administrateur BBP (string)
   created_at: [Cliquez sur l'horloge pour timestamp]
   ```
6. **Cliquez sur "Save"**

### 🛡️ **ÉTAPE 5 : Configurer les règles Firestore**

1. **Dans "Firestore Database", cliquez sur "Rules"**
2. **Remplacez tout le contenu par :**

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

3. **Cliquez sur "Publish"**

### 🗂️ **ÉTAPE 6 : Créer les collections de base**

Créez ces collections vides dans Firestore :

1. **Collection `bookings`** (pour les réservations)
2. **Collection `products`** (pour la boutique)
3. **Collection `blog_posts`** (pour les articles)
4. **Collection `videos`** (pour les vidéos)

Pour chaque collection :
- **Cliquez sur "Start collection"**
- **Entrez le nom de la collection**
- **Créez un document temporaire** (vous pourrez le supprimer après)

### ✅ **ÉTAPE 7 : Tester la connexion**

1. **Allez sur votre site** : `/login`
2. **Connectez-vous avec :**
   - **Email** : `admin@bambaperformance.com`
   - **Mot de passe** : `!*$Root-1!*$`
3. **Vous devriez être redirigé vers** `/admin`

## 🚨 **POINTS IMPORTANTS**

### ⚠️ **Si vous avez des erreurs :**

1. **Vérifiez que Firestore est activé** (pas Realtime Database)
2. **Vérifiez que Authentication est activé** avec Email/Password
3. **Vérifiez que l'utilisateur admin existe** dans Authentication
4. **Vérifiez que le profil admin existe** dans Firestore collection `users`
5. **Vérifiez que les règles sont publiées** sans erreur

### 🔧 **Configuration automatique alternative**

Si vous préférez, vous pouvez aussi :
1. **Aller sur `/admin/setup`** dans votre application
2. **Cliquer sur "Lancer la configuration"**
3. **L'application créera automatiquement** l'utilisateur et les données

## 📞 **Besoin d'aide ?**

Si vous rencontrez des problèmes :
1. **Vérifiez la console du navigateur** pour les erreurs
2. **Vérifiez que votre fichier `.env`** contient les bonnes clés Firebase
3. **Assurez-vous que Firestore est activé** (pas Realtime Database)

Une fois ces étapes terminées, votre application BBP Performance sera entièrement fonctionnelle ! 🚀