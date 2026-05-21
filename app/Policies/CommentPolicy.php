<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    // Vérifier que l'utilisateur peut modifier son propre commentaire
    public function update(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id;
    }

    // Vérifier que l'utilisateur peut supprimer son propre commentaire
    public function destroy(User $user, Comment $comment): bool
    {
        return $user->id === $comment->user_id;
    }
}
