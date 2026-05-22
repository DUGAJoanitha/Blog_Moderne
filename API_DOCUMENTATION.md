# Blog API - Documentation Complète

## 📋 Résumé des Endpoints

**20 endpoints au total** : 3 Auth + 5 Articles + 3 Comments + 2 Images + 5 Users + 2 Newsletter

### 1. **Authentification** (3 endpoints)
- `POST /api/register` - Créer un compte
- `POST /api/login` - Se connecter
- `POST /api/logout` - Se déconnecter (protégé)

### 2. **Articles** (5 endpoints)
- `GET /api/articles` - Lister les articles publiés (public)
- `GET /api/articles/{slug}` - Voir un article (public)
- `POST /api/articles` - Créer un article (protégé)
- `PUT /api/articles/{article}` - Modifier son article (protégé)
- `DELETE /api/articles/{article}` - Supprimer son article (protégé)

### 3. **Commentaires** (3 endpoints)
- `POST /api/articles/{article}/comments` - Ajouter un commentaire (protégé)
- `PUT /api/comments/{comment}` - Modifier son commentaire (protégé)
- `DELETE /api/comments/{comment}` - Supprimer son commentaire (protégé)

### 4. **Images** (2 endpoints)
- `POST /api/articles/{article}/images` - Uploader une image (protégé)
- `DELETE /api/images/{image}` - Supprimer une image (protégé)

### 5. **Utilisateurs** (5 endpoints)
- `GET /api/users` - Lister les utilisateurs (protégé)
- `POST /api/users` - Créer un utilisateur (protégé)
- `GET /api/users/{user}` - Voir un utilisateur (protégé)
- `PUT /api/users/{user}` - Mettre à jour son compte (protégé)
- `DELETE /api/users/{user}` - Supprimer son compte (protégé)

### 6. **Newsletter** (2 endpoints)
- `POST /api/newsletter/subscribe` - S'inscrire (public)
- `POST /api/newsletter/unsubscribe` - Se désinscrire (public)

---

## 🚀 Installation et Configuration

### Prérequis
- PHP 8.3+
- Laravel 11+
- MySQL ou SQLite
- Composer
- Postman (pour les tests manuels)

### 1. Installation des dépendances
```bash
cd c:\Users\M. DZIFA\blog
composer install
```

### 2. Configuration du fichier `.env`
```bash
cp .env.example .env
```

Configurer les variables essentielles :
```env
APP_URL=http://localhost:8000
APP_DEBUG=true
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
# ou
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=blog
# DB_USERNAME=root
# DB_PASSWORD=

# Si vous utilisez Sanctum en mode cookie pour un SPA, configurez :
# SANCTUM_STATEFUL_DOMAINS=localhost
```

### 3. Générer une clé d'application
```bash
php artisan key:generate
```

### 4. Exécuter les migrations
```bash
php artisan migrate
```

### 5. Créer le lien de stockage public (pour les images)
```bash
php artisan storage:link
```

### 6. Lancer le serveur
```bash
php artisan serve
```

Le serveur s'exécute sur `http://localhost:8000`

---

## 🧪 Tests avec Postman

### Importer la collection
1. Ouvrir Postman
2. Cliquer sur **Import**
3. Sélectionner le fichier `Blog_API.postman_collection.json`
4. Configurer les variables d'environnement :
   - `base_url` = `http://localhost:8000`
   - `token` = (à remplir après login)

### Workflow de test complet

#### **1. Enregistrement**
```bash
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```
**Réponse** : Token + User

#### **2. Connexion**
```bash
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Réponse** : Token (Copier dans `{{token}}`)

#### **3. Créer un article**
```bash
POST /api/articles
Authorization: Bearer {{token}}
{
  "title": "Mon Premier Article",
  "content": "Contenu de l'article",
  "status": "published"
}
```
**Réponse** : 201 + Article

#### **4. Lister les articles**
```bash
GET /api/articles
```
**Réponse** : 200 + Array of articles

#### **5. Ajouter un commentaire**
```bash
POST /api/articles/1/comments
Authorization: Bearer {{token}}
{
  "content": "Excellent article!"
}
```
**Réponse** : 201 + Comment

#### **6. Uploader une image**
```bash
POST /api/articles/1/images
Authorization: Bearer {{token}}
Body: form-data
  - image: (file)
```
**Réponse** : 201 + Image

#### **7. S'inscrire à la newsletter**
```bash
POST /api/newsletter/subscribe
{
  "email": "subscriber@example.com"
}
```
**Réponse** : 201

---

## 📊 Audit de Validation

| Endpoint | Statut | Testé |
|----------|--------|-------|
| POST /register | ✅ | - |
| POST /login | ✅ | - |
| POST /logout | ✅ | - |
| GET /articles | ✅ | - |
| POST /articles | ✅ | - |
| GET /articles/{slug} | ✅ | - |
| PUT /articles/{article} | ✅ | - |
| DELETE /articles/{article} | ✅ | - |
| POST /articles/{article}/comments | ✅ | - |
| PUT /comments/{comment} | ✅ | - |
| DELETE /comments/{comment} | ✅ | - |
| POST /articles/{article}/images | ✅ | - |
| DELETE /images/{image} | ✅ | - |
| GET /api/users | ✅ | - |
| POST /api/users | ✅ | - |
| GET /api/users/{user} | ✅ | - |
| PUT /api/users/{user} | ✅ | - |
| DELETE /api/users/{user} | ✅ | - |
| POST /newsletter/subscribe | ✅ | - |
| POST /newsletter/unsubscribe | ✅ | - |

---

## 🧬 Modèles et Migrations

### Relations
```
User
├── Articles (1 to N)
└── Comments (1 to N)

Article
├── User (N to 1)
├── Comments (1 to N)
└── ArticleImages (1 to N)

Comment
├── Article (N to 1)
└── User (N to 1)

ArticleImage
└── Article (N to 1)

Newsletter
└── Email unique
```

---

## 🔐 Sécurité

### Authentification
- Token-based avec **Laravel Sanctum**
- Chaque requête protégée nécessite un Bearer token

### Autorisation
- **Policies** : ArticlePolicy, CommentPolicy, UserPolicy
- Seuls les auteurs peuvent modifier/supprimer leurs contenus
- Les articles, commentaires et comptes utilisateur ne peuvent être modifiés que par leur créateur/propriétaire

### Validation
- Email unique pour les utilisateurs et newsletter
- Mot de passe minimum 8 caractères
- Contenu minimum 3 caractères pour les commentaires

---

## 🛠️ Commandes Utiles

### Vérifier les routes
```bash
php artisan route:list --path=api
```

### Vider les caches
```bash
php artisan route:clear
php artisan cache:clear
php artisan config:cache
```

### Exécuter les tests
```bash
php artisan test
php artisan test tests/Feature/ApiEndpointsTest.php
```

### Générer des données de test
```bash
php artisan tinker
>>> App\Models\User::factory(10)->create()
>>> App\Models\Article::factory(20)->create()
>>> exit
```

---

## 📝 Logs et Débogage

### Afficher les logs
```bash
# Dernières 100 lignes
Get-Content storage\logs\laravel.log -Tail 100

# Suivi en temps réel (tail)
Get-Content -Path storage\logs\laravel.log -Wait
```

### Mode debug
Dans `.env` :
```env
APP_DEBUG=true
```

---

## ✅ Checklist de Mise en Production

- [ ] APP_DEBUG=false
- [ ] APP_ENV=production
- [ ] Générer une APP_KEY
- [ ] Configurer une BD en production
- [ ] Mettre en place CORS si nécessaire
- [ ] Configurer HTTPS/SSL
- [ ] Tester tous les endpoints
- [ ] Monitoring et logging configurés
- [ ] Backups de la BD

---

## 📞 Support et Dépannage

### Problème : Erreur 404 sur les routes
**Solution** : Vider les caches
```bash
php artisan route:clear
php artisan cache:clear
```

### Problème : Unauthorized (401)
**Solution** : Vérifier le token dans les headers
```
Authorization: Bearer votre_token_ici
```

### Problème : Policy check failed
**Solution** : Vérifier que vous êtes l'auteur de la ressource

### Problème : Image non uploadée
**Solution** : Créer le dossier
```bash
mkdir -p storage/app/public/articles
php artisan storage:link
```

---

**Version** : 1.0  
**Dernière mise à jour** : 21 mai 2026
