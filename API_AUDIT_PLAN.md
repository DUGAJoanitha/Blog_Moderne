# Audit et Plan des Endpoints API Blog

## 📊 Audit Complet des Endpoints

### Auth ✅
- `POST /api/register` - AuthController::register
- `POST /api/login` - AuthController::login
- `POST /api/logout` - AuthController::logout (protégé)

### Articles ✅
- `GET /api/articles` - ArticleController::index (public)
- `GET /api/articles/{slug}` - ArticleController::show (public)
- `POST /api/articles` - ArticleController::store (protégé)
- `PUT /api/articles/{article}` - ArticleController::update (protégé)
- `DELETE /api/articles/{article}` - ArticleController::destroy (protégé)

### Comments ✅
- `POST /api/articles/{article}/comments` - CommentController::store (protégé)
- `PUT /api/comments/{comment}` - CommentController::update (protégé)
- `DELETE /api/comments/{comment}` - CommentController::destroy (protégé)

### Images ✅
- `POST /api/articles/{article}/images` - ImageController::store (protégé)
- `DELETE /api/images/{image}` - ImageController::destroy (protégé)

### Newsletter ✅
- `POST /api/newsletter/subscribe` - NewsletterController::subscribe (public)
- `POST /api/newsletter/unsubscribe` - NewsletterController::unsubscribe (public)

---

## 📋 Total : 15 endpoints

| Catégorie | Nombre | Statut |
|-----------|--------|--------|
| Auth | 3 | ✅ Implémenté |
| Articles | 5 | ✅ Implémenté |
| Comments | 3 | ✅ Implémenté |
| Images | 2 | ✅ Implémenté |
| Newsletter | 2 | ✅ Implémenté |

---

## 🛡️ Sécurité et Autorisation

### Policies créées :
- `ArticlePolicy` - Vérifier que l'utilisateur est l'auteur de l'article
- `CommentPolicy` - Vérifier que l'utilisateur est l'auteur du commentaire

### Middleware de sécurité :
- `auth:sanctum` - Protège les routes privées
- Authorization via Bearer Token (JWT via Sanctum)

---

## 📦 Modèles et Relations

```
User
├── Articles (hasMany)
└── Comments (hasMany)

Article
├── User (belongsTo)
├── Comments (hasMany)
└── Images (hasMany)

Comment
├── Article (belongsTo)
└── User (belongsTo)

ArticleImage
└── Article (belongsTo)

Newsletter
└── Email (unique)
```

---

## 🧪 Tester les Endpoints

### 1. Importer la collection Postman
- Fichier : `Blog_API.postman_collection.json`
- Importer dans Postman

### 2. Configurer les variables
Dans Postman, définir :
- `base_url` = `http://localhost:8000`
- `token` = Remplir après login

### 3. Workflow de test recommandé
1. **POST /api/register** - Créer un utilisateur de test
2. **POST /api/login** - Se connecter et récupérer le token
3. **Copier le token** → Définir `{{token}}` dans Postman
4. **POST /api/articles** - Créer un article
5. **GET /api/articles** - Lister les articles
6. **GET /api/articles/{slug}** - Afficher un article
7. **POST /api/articles/{id}/comments** - Ajouter un commentaire
8. **POST /api/articles/{id}/images** - Uploader une image
9. **POST /api/newsletter/subscribe** - S'inscrire à la newsletter

---

## ✅ Checklist de Validation

- [x] Tous les contrôleurs implémentés
- [x] Tous les modèles créés
- [x] Relations entre modèles vérifiées
- [x] Policies d'autorisation créées
- [x] Collection Postman générée
- [ ] Tests manuels passés
- [ ] Vérifier les erreurs de validation
- [ ] Vérifier les permissions (authorization)

---

## 🚀 Prochaines étapes

1. **Lancer le serveur Laravel**
   ```bash
   php artisan serve
   ```

2. **Tester les endpoints avec Postman**

3. **Vérifier les logs d'erreur**
   ```bash
   tail -f storage/logs/laravel.log
   ```

4. **Améliorer les validations et réponses d'erreur**

---

## 📝 Notes Importantes

- Les tokens Sanctum ont une durée de vie par défaut
- Les images sont stockées dans `storage/app/public/articles`
- Les commentaires et articles ne peuvent être modifiés que par leurs auteurs
- La newsletter accepte des inscriptions/désinscriptions sans authentification
