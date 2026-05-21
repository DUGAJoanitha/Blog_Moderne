<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
{
    // Vérifier que l'utilisateur peut modifier son propre article
    public function update(User $user, Article $article): bool
    {
        return $user->id === $article->user_id;
    }

    // Vérifier que l'utilisateur peut supprimer son propre article
    public function destroy(User $user, Article $article): bool
    {
        return $user->id === $article->user_id;
    }
}
