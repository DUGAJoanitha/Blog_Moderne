<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArticleImage;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function index()
    {
        $images = ArticleImage::with('article:id,title,slug')
            ->latest()
            ->get()
            ->map(function ($image) {
                $image->url = Storage::disk('public')->url($image->path);
                return $image;
            });

        return response()->json($images);
    }

    public function store(Request $request, Article $article)
    {
        $this->authorize('update', $article);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,gif|max:5120',
        ]);

        $path = $request->file('image')->store('articles', 'public');

        $image = ArticleImage::create([
            'article_id'    => $article->id,
            'path'          => $path,
            'original_name' => $request->file('image')->getClientOriginalName(),
        ]);

        $image->url = Storage::disk('public')->url($path);
        $image->load('article:id,title,slug');

        return response()->json($image, 201);
    }

    public function storeOrphan(Request $request)
    {
        $request->validate([
            'image'      => 'required|image|mimes:jpeg,png,gif|max:5120',
            'article_id' => 'required|exists:articles,id',
        ]);

        $article = Article::findOrFail($request->article_id);
        $this->authorize('update', $article);

        $path = $request->file('image')->store('articles', 'public');

        $image = ArticleImage::create([
            'article_id'    => $article->id,
            'path'          => $path,
            'original_name' => $request->file('image')->getClientOriginalName(),
        ]);

        $image->url = Storage::disk('public')->url($path);
        $image->load('article:id,title,slug');

        return response()->json($image, 201);
    }

    public function destroy(ArticleImage $image)
    {
        $this->authorize('update', $image->article);

        Storage::disk('public')->delete($image->path);
        $image->delete();

        return response()->json(['message' => 'Image supprimée']);
    }
}
