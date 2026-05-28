<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use App\Models\Newsletter;
use App\Models\ArticleImage;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'articles'    => Article::where('user_id', auth()->id())->count(),
            'published'   => Article::where('user_id', auth()->id())->where('status', 'published')->count(),
            'drafts'      => Article::where('user_id', auth()->id())->where('status', 'draft')->count(),
            'comments'    => Comment::whereHas('article', fn($q) => $q->where('user_id', auth()->id()))->count(),
            'newsletters' => Newsletter::where('active', true)->count(),
            'media'       => ArticleImage::whereHas('article', fn($q) => $q->where('user_id', auth()->id()))->count(),
        ]);
    }
}
