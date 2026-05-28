<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with(['user', 'images'])
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(10);

        return response()->json($articles);
    }

    public function adminIndex()
    {
        $articles = Article::with(['user', 'images'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($articles);
    }

    public function adminShow($id)
    {
        $article = Article::with(['user', 'images', 'comments.user'])
            ->where('user_id', auth()->id())
            ->findOrFail($id);

        $article->images->transform(function ($image) {
            $image->url = \Storage::disk('public')->url($image->path);
            return $image;
        });

        return response()->json($article);
    }

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

    public function show($slug)
    {
        $article = Article::with(['user', 'comments.user', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($article);
    }

    public function update(Request $request, Article $article)
    {
        $this->authorize('update', $article);

        $article->update($request->only(['title', 'content', 'status']));
        return response()->json($article);
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return response()->json(['message' => 'Article supprimé']);
    }
}