# TODO - Implémentation vidéo de fond sur la page d'accueil

## ✅ Étapes complétées
- [x] Modifier le composant Hero pour remplacer l'image par une vidéo
- [x] Configurer la vidéo en boucle (loop)
- [x] Configurer la vidéo sans son (muted)
- [x] Ajouter l'attribut playsInline pour la compatibilité mobile
- [x] Utiliser object-cover pour l'adaptation responsive

## 🔄 Étapes de vérification à effectuer
- [ ] Tester que la vidéo se charge et joue correctement
- [ ] Vérifier la responsivité sur différents appareils
- [ ] Confirmer que l'autoplay fonctionne
- [ ] Vérifier que le texte reste lisible avec l'overlay
- [ ] Tester sur mobile (playsInline)

## 📋 Commandes de test suggérées
```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir dans le navigateur et vérifier :
# 1. La vidéo se charge automatiquement
# 2. La vidéo tourne en boucle
# 3. La vidéo s'adapte à la taille de l'écran
# 4. Le texte reste lisible
# 5. Pas de son (muted)
```

## 🎯 Résultat attendu
- Vidéo de fond qui tourne en boucle sur la page d'accueil
- Adaptation automatique à tous les types d'écran
- Texte parfaitement lisible avec l'overlay
- Performance optimale sur desktop et mobile
