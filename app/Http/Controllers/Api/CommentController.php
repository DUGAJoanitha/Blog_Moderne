<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Article;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index()
    {
        $comments = Comment::with(['user:id,name,email', 'article:id,title,slug'])
            ->whereHas('article', fn($q) => $q->where('user_id', auth()->id()))
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function byArticle(Article $article)
    {
        $comments = Comment::with('user:id,name,email')
            ->where('article_id', $article->id)
            ->latest()
            ->get();

        return response()->json($comments);
    }

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

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $request->validate([
            'content' => 'required|string|min:3',
        ]);

        $comment->update(['content' => $request->content]);
        return response()->json($comment);
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('destroy', $comment);

        $comment->delete();
        return response()->json(['message' => 'Commentaire supprimé']);
    }
}
