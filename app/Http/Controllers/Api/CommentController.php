<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Article;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Créer un commentaire sur un article
    public function store(Request $request, Article $article)
    {
        $request->validate([
            'content' => 'required|string|min:3',
        ]);

        $comment = Comment::create([
            'article_id' => $article->id,
            'user_id'    => auth()->id(),
            'content'    => $request->content,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    // Modifier un commentaire
    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment); // Vérifier que c'est l'auteur

        $request->validate([
            'content' => 'required|string|min:3',
        ]);

        $comment->update(['content' => $request->content]);
        return response()->json($comment);
    }

    // Supprimer un commentaire
    public function destroy(Comment $comment)
    {
        $this->authorize('destroy', $comment); // Vérifier que c'est l'auteur

        $comment->delete();
        return response()->json(['message' => 'Commentaire supprimé']);
    }
}
