<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Article;
use App\Models\Comment;
use Tests\TestCase;

class ApiEndpointsTest extends TestCase
{
    private $user;
    private $token;
    private $article;

    public function setUp(): void
    {
        parent::setUp();
        // Créer un utilisateur pour les tests
        $this->user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);
        
        // Créer un token
        $this->token = $this->user->createToken('test_token')->plainTextToken;
    }

    // ✅ Tests Auth
    public function test_register_endpoint()
    {
        $response = $this->postJson('/api/register', [
            'name'                  => 'New User',
            'email'                 => 'newuser@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['token', 'user']);
    }

    public function test_login_endpoint()
    {
        $response = $this->postJson('/api/login', [
            'email'    => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token', 'user']);
    }

    public function test_logout_endpoint()
    {
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->postJson('/api/logout');

        $response->assertStatus(200);
    }

    // ✅ Tests Articles
    public function test_get_articles_list()
    {
        Article::factory(5)->create(['status' => 'published']);

        $response = $this->getJson('/api/articles');

        $response->assertStatus(200);
    }

    public function test_create_article()
    {
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->postJson('/api/articles', [
            'title'   => 'Test Article',
            'content' => 'This is test content',
            'status'  => 'published',
        ]);

        $response->assertStatus(201);
        $this->article = Article::latest()->first();
    }

    public function test_get_article_by_slug()
    {
        $article = Article::factory()->create(['status' => 'published']);

        $response = $this->getJson("/api/articles/{$article->slug}");

        $response->assertStatus(200);
    }

    public function test_update_article()
    {
        $article = Article::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->putJson("/api/articles/{$article->id}", [
            'title'   => 'Updated Title',
            'content' => 'Updated content',
            'status'  => 'draft',
        ]);

        $response->assertStatus(200);
    }

    public function test_delete_article()
    {
        $article = Article::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->deleteJson("/api/articles/{$article->id}");

        $response->assertStatus(200);
    }

    // ✅ Tests Comments
    public function test_create_comment()
    {
        $article = Article::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->postJson("/api/articles/{$article->id}/comments", [
            'content' => 'Great article!',
        ]);

        $response->assertStatus(201);
    }

    public function test_update_comment()
    {
        $article = Article::factory()->create();
        $comment = Comment::factory()->create([
            'article_id' => $article->id,
            'user_id'    => $this->user->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->putJson("/api/comments/{$comment->id}", [
            'content' => 'Updated comment',
        ]);

        $response->assertStatus(200);
    }

    public function test_delete_comment()
    {
        $article = Article::factory()->create();
        $comment = Comment::factory()->create([
            'article_id' => $article->id,
            'user_id'    => $this->user->id,
        ]);

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->deleteJson("/api/comments/{$comment->id}");

        $response->assertStatus(200);
    }

    // ✅ Tests Newsletter
    public function test_subscribe_newsletter()
    {
        $response = $this->postJson('/api/newsletter/subscribe', [
            'email' => 'subscriber@example.com',
        ]);

        $response->assertStatus(201);
    }

    public function test_unsubscribe_newsletter()
    {
        $this->postJson('/api/newsletter/subscribe', [
            'email' => 'subscriber@example.com',
        ]);

        $response = $this->postJson('/api/newsletter/unsubscribe', [
            'email' => 'subscriber@example.com',
        ]);

        $response->assertStatus(200);
    }

    // ✅ Tests Utilisateurs
    public function test_get_users_list()
    {
        User::factory(3)->create();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->getJson('/api/users');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data']);
    }

    public function test_create_user()
    {
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->postJson('/api/users', [
            'name'                  => 'New User',
            'email'                 => 'newuser@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'name', 'email', 'created_at']);
    }

    public function test_get_user_by_id()
    {
        $otherUser = User::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->getJson("/api/users/{$otherUser->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment(['email' => $otherUser->email]);
    }

    public function test_update_user()
    {
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->putJson("/api/users/{$this->user->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Updated Name']);
    }

    public function test_cannot_update_another_user()
    {
        $otherUser = User::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->putJson("/api/users/{$otherUser->id}", [
            'name' => 'Hacked Name',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $otherUser->id, 'name' => $otherUser->name]);
    }

    public function test_delete_user()
    {
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->deleteJson("/api/users/{$this->user->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $this->user->id]);
    }

    public function test_cannot_delete_another_user()
    {
        $otherUser = User::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$this->token}",
        ])->deleteJson("/api/users/{$otherUser->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $otherUser->id]);
    }
}
