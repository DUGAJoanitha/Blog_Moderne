<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\UserController;

// ─── Auth ─────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ─── Articles publics (sans token) ────────────────
Route::get('/articles',            [ArticleController::class, 'index']);
Route::get('/articles/{slug}',     [ArticleController::class, 'show']);

// ─── Routes protégées (token requis) ──────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    // Articles
    Route::post('/articles',             [ArticleController::class, 'store']);
    Route::put('/articles/{article}',    [ArticleController::class, 'update']);
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy']);

    // Commentaires
    Route::post('/articles/{article}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}',           [CommentController::class, 'update']);
    Route::delete('/comments/{comment}',        [CommentController::class, 'destroy']);

    // Images
    Route::post('/articles/{article}/images', [ImageController::class, 'store']);
    Route::delete('/images/{image}',          [ImageController::class, 'destroy']);

    // Utilisateurs
    Route::get('/users',          [UserController::class, 'index']);
    Route::post('/users',         [UserController::class, 'store']);
    Route::get('/users/{user}',   [UserController::class, 'show']);
    Route::put('/users/{user}',   [UserController::class, 'update']);
    Route::delete('/users/{user}',[UserController::class, 'destroy']);
});

// ─── Newsletter (public) ───────────────────────────
Route::post('/newsletter/subscribe',   [NewsletterController::class, 'subscribe']);
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);
