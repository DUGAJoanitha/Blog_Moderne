<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArticleImage;
use App\Models\Article;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    // Uploader une image pour un article
    public function store(Request $request, Article $article)
    {
        $this->authorize('update', $article); // Vérifier que c'est l'auteur

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,gif|max:5120', // 5MB max
        ]);

        $path = $request->file('image')->store('articles', 'public');

        $image = ArticleImage::create([
            'article_id'   => $article->id,
            'path'         => $path,
            'original_name' => $request->file('image')->getClientOriginalName(),
        ]);

        return response()->json($image, 201);
    }

    // Supprimer une image
    public function destroy(ArticleImage $image)
    {
        $this->authorize('update', $image->article); // Vérifier que c'est l'auteur

        $image->delete();
        return response()->json(['message' => 'Image supprimée']);
    }
}
