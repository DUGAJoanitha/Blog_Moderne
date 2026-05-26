<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::select(['id', 'name', 'email', 'created_at'])
            ->latest('created_at')
            ->paginate(15);

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
        ]);

        return response()->json($user, 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:8|confirmed',
        ]);

        $user->update(array_filter([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->filled('password') ? $request->password : null,
        ]));

        return response()->json($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('destroy', $user);

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
