<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // Liste tous les articles publiés
    public function index()
    {
        $articles = Article::with(['user', 'images'])
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(10);

        return response()->json($articles);
    }

    // Créer un article
    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required',
            'status'  => 'in:draft,published',
        ]);

        $article = Article::create([
            'user_id'      => auth()->id(),
            'title'        => $request->title,
            'content'      => $request->content,
            'status'       => $request->status ?? 'draft',
            'published_at' => $request->status === 'published' ? now() : null,
        ]);

        return response()->json($article, 201);
    }

    // Afficher un article
    public function show($slug)
    {
        $article = Article::with(['user', 'comments.user', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($article);
    }

    // Modifier un article
    public function update(Request $request, Article $article)
    {
        $this->authorize('update', $article); // optionnel

        $article->update($request->only(['title', 'content', 'status']));
        return response()->json($article);
    }

    // Supprimer un article
    public function destroy(Article $article)
    {
        $article->delete();
        return response()->json(['message' => 'Article supprimé']);
    }
}