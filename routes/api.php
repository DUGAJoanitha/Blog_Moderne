<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StatsController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::get('/articles',        [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/stats', [StatsController::class, 'index']);

    Route::get('/admin/articles',         [ArticleController::class, 'adminIndex']);
    Route::get('/admin/articles/{id}',    [ArticleController::class, 'adminShow']);
    Route::post('/articles',                 [ArticleController::class, 'store']);
    Route::put('/articles/{article}',        [ArticleController::class, 'update']);
    Route::delete('/articles/{article}',     [ArticleController::class, 'destroy']);

    Route::get('/admin/comments',                          [CommentController::class, 'index']);
    Route::get('/articles/{article}/comments',             [CommentController::class, 'byArticle']);
    Route::post('/articles/{article}/comments',            [CommentController::class, 'store']);
    Route::put('/comments/{comment}',                      [CommentController::class, 'update']);
    Route::delete('/comments/{comment}',                   [CommentController::class, 'destroy']);

    Route::get('/admin/newsletters',                       [NewsletterController::class, 'index']);
    Route::patch('/admin/newsletters/{newsletter}/toggle', [NewsletterController::class, 'toggle']);
    Route::delete('/admin/newsletters/{newsletter}',       [NewsletterController::class, 'destroy']);

    Route::get('/images',                     [ImageController::class, 'index']);
    Route::post('/images',                    [ImageController::class, 'storeOrphan']);
    Route::post('/articles/{article}/images', [ImageController::class, 'store']);
    Route::delete('/images/{image}',          [ImageController::class, 'destroy']);

    Route::get('/users',           [UserController::class, 'index']);
    Route::post('/users',          [UserController::class, 'store']);
    Route::get('/users/{user}',    [UserController::class, 'show']);
    Route::put('/users/{user}',    [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});

Route::post('/newsletter/subscribe',   [NewsletterController::class, 'subscribe']);
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);
