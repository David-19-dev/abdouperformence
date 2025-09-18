# 📧 Guide Complet de Configuration Brevo pour BBP Performance

## 🎯 **ÉTAPES À SUIVRE DANS L'ORDRE**

### 📝 **ÉTAPE 1 : Créer un compte Brevo**

1. **Allez sur** : https://www.brevo.com/
2. **Cliquez sur "S'inscrire gratuitement"**
3. **Remplissez le formulaire** :
   - Nom de l'entreprise : `BBP Performance`
   - Email professionnel : `admin@bambaperformance.com` (ou votre email)
   - Mot de passe sécurisé
   - Pays : `Sénégal`
4. **Validez votre email** en cliquant sur le lien reçu
5. **Complétez votre profil** si demandé

### 🔑 **ÉTAPE 2 : Obtenir votre clé API**

1. **Connectez-vous à votre compte Brevo**
2. **Cliquez sur votre nom** en haut à droite
3. **Sélectionnez "Clés API"** dans le menu
4. **Cliquez sur "Générer une nouvelle clé API"**
5. **Donnez un nom** : `BBP Performance Website`
6. **Copiez la clé API** (elle commence par `xkeysib-`)
7. **⚠️ IMPORTANT** : Sauvegardez cette clé, elle ne sera plus affichée !

### 📧 **ÉTAPE 3 : Configurer l'expéditeur**

1. **Allez dans "Expéditeurs et domaines"** (menu de gauche)
2. **Cliquez sur "Ajouter un expéditeur"**
3. **Remplissez** :
   - **Nom** : `BBP Performance`
   - **Email** : `noreply@bambaperformance.com` (ou votre domaine)
   - **Adresse de réponse** : `contact@bambaperformance.com`
4. **Cliquez sur "Créer"**

### 🎨 **ÉTAPE 4 : Créer les templates d'email**

#### Template 1 : Confirmation de réservation

1. **Allez dans "Templates"** → **"Templates d'email"**
2. **Cliquez sur "Créer un template"**
3. **Choisissez "Drag & Drop Editor"**
4. **Nom du template** : `Confirmation Réservation BBP`
5. **Créez le template avec ce contenu** :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de réservation - BBP Performance</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3a8a, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏋️ BBP Performance</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 16px;">Votre réservation est confirmée !</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #1f2937; margin-top: 0;">Bonjour {{contact_name}} ! 👋</h2>
            
            <p>Nous avons bien reçu votre demande de réservation. Voici les détails :</p>
            
            <!-- Booking Details -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">📋 Détails de votre réservation</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Type de séance :</td>
                        <td style="padding: 8px 0;">{{session_type}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Objectif :</td>
                        <td style="padding: 8px 0;">{{goal}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Date souhaitée :</td>
                        <td style="padding: 8px 0;">{{preferred_date}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Heure souhaitée :</td>
                        <td style="padding: 8px 0;">{{preferred_time}}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Next Steps -->
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">🚀 Prochaines étapes</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Notre équipe va examiner votre demande</li>
                    <li>Nous vous contacterons sous 24h pour confirmer le créneau</li>
                    <li>Vous recevrez un email de confirmation définitive</li>
                </ul>
            </div>
            
            <!-- Contact Info -->
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">📞 Nous contacter</h3>
                <p style="margin: 5px 0;"><strong>Téléphone :</strong> +221 77 123 45 67</p>
                <p style="margin: 5px 0;"><strong>Email :</strong> contact@bambaperformance.com</p>
                <p style="margin: 5px 0;"><strong>Adresse :</strong> 123 Rue Fitness, Dakar, Sénégal</p>
            </div>
            
            <p>Merci de votre confiance ! 💪</p>
            <p><strong>L'équipe BBP Performance</strong></p>
        </div>
        
        <!-- Footer -->
        <div style="background: #374151; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                © 2024 BBP Performance - Tous droits réservés
            </p>
            <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
                Vous recevez cet email car vous avez effectué une réservation sur notre site.
            </p>
        </div>
    </div>
</body>
</html>
```

6. **Sauvegardez le template**

#### Template 2 : Mise à jour de statut

1. **Créez un nouveau template** : `Mise à jour Réservation BBP`
2. **Utilisez ce contenu** :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Mise à jour de votre réservation - BBP Performance</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3a8a, #dc2626); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏋️ BBP Performance</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 16px;">Mise à jour de votre réservation</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #1f2937; margin-top: 0;">Bonjour {{contact_name}} ! 👋</h2>
            
            <p>Le statut de votre réservation a été mis à jour :</p>
            
            <!-- Status Update -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                <h3 style="color: #0c4a6e; margin-top: 0;">📋 Nouveau statut : {{status}}</h3>
                <p style="margin: 0;">{{status_message}}</p>
            </div>
            
            <!-- Booking Details -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">📅 Rappel de votre réservation</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Date :</td>
                        <td style="padding: 8px 0;">{{preferred_date}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Heure :</td>
                        <td style="padding: 8px 0;">{{preferred_time}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Type :</td>
                        <td style="padding: 8px 0;">{{session_type}}</td>
                    </tr>
                </table>
            </div>
            
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <p><strong>L'équipe BBP Performance</strong></p>
        </div>
        
        <!-- Footer -->
        <div style="background: #374151; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                © 2024 BBP Performance - Tous droits réservés
            </p>
        </div>
    </div>
</body>
</html>
```

### 🔧 **ÉTAPE 5 : Configuration dans votre fichier .env**

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration Brevo
VITE_BREVO_API_KEY=xkeysib-votre_cle_api_ici
VITE_BREVO_SENDER_EMAIL=noreply@bambaperformance.com
VITE_BREVO_SENDER_NAME=BBP Performance
VITE_BREVO_ADMIN_EMAIL=admin@bambaperformance.com

# Templates Brevo (IDs à récupérer après création)
VITE_BREVO_BOOKING_TEMPLATE_ID=1
VITE_BREVO_STATUS_UPDATE_TEMPLATE_ID=2
```

### 📋 **ÉTAPE 6 : Récupérer les IDs des templates**

1. **Dans Brevo, allez dans "Templates"**
2. **Cliquez sur votre template de confirmation**
3. **Dans l'URL, notez l'ID** (ex: `/templates/1`)
4. **Répétez pour le template de mise à jour**
5. **Mettez à jour les IDs dans votre `.env`**

### ✅ **ÉTAPE 7 : Tester le système**

1. **Redémarrez votre serveur** : `npm run dev`
2. **Allez sur `/booking`**
3. **Faites une réservation test**
4. **Vérifiez que l'email arrive**
5. **Testez les changements de statut depuis l'admin**

### 🎨 **ÉTAPE 8 : Personnaliser les templates (optionnel)**

Dans Brevo, vous pouvez :
- **Modifier les couleurs** pour correspondre à votre charte
- **Ajouter votre logo**
- **Personnaliser les messages**
- **Ajouter des liens vers vos réseaux sociaux**

### 📊 **ÉTAPE 9 : Surveiller les envois**

Dans Brevo, vous pouvez :
- **Voir les statistiques d'envoi**
- **Vérifier les emails délivrés/ouverts**
- **Gérer les bounces et désabonnements**

## 🚨 **POINTS IMPORTANTS**

### ⚠️ **Limites du plan gratuit Brevo :**
- **300 emails/jour**
- **Branding Brevo** dans les emails
- **Support par email uniquement**

### 🔒 **Sécurité :**
- **Ne partagez jamais votre clé API**
- **Utilisez des variables d'environnement**
- **Vérifiez régulièrement les logs d'envoi**

### 📈 **Pour passer au plan payant :**
- **Plus d'emails/jour**
- **Suppression du branding Brevo**
- **Support prioritaire**
- **Fonctionnalités avancées**

## 🛠️ **DÉPANNAGE**

### ❌ **Si les emails ne partent pas :**

1. **Vérifiez votre clé API** dans `.env`
2. **Vérifiez que l'expéditeur est validé** dans Brevo
3. **Regardez la console du navigateur** pour les erreurs
4. **Vérifiez les quotas** dans votre dashboard Brevo

### ❌ **Si les emails arrivent en spam :**

1. **Configurez SPF/DKIM** dans Brevo
2. **Utilisez un domaine personnalisé**
3. **Évitez les mots "spam" dans le contenu**
4. **Demandez aux clients d'ajouter votre email aux contacts**

### ❌ **Erreurs courantes :**

- **401 Unauthorized** : Clé API incorrecte
- **400 Bad Request** : Format d'email invalide
- **402 Payment Required** : Quota dépassé

## 📞 **SUPPORT**

- **Documentation Brevo** : https://developers.brevo.com/
- **Support Brevo** : Via votre dashboard
- **FAQ BBP** : Consultez ce guide en cas de problème

## 🎉 **FÉLICITATIONS !**

Une fois configuré, votre système enverra automatiquement :
- ✅ **Email de confirmation** à chaque nouvelle réservation
- ✅ **Email de mise à jour** quand vous changez le statut
- ✅ **Emails professionnels** avec votre branding
- ✅ **Notifications admin** pour les nouveaux messages

Votre système de réservation est maintenant professionnel ! 🚀