<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    // S'inscrire à la newsletter
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters',
        ]);

        $newsletter = Newsletter::create([
            'email'  => $request->email,
            'active' => true,
        ]);

        return response()->json(['message' => 'Inscription réussie', 'data' => $newsletter], 201);
    }

    // Se désinscrire de la newsletter
    public function unsubscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $newsletter = Newsletter::where('email', $request->email)->first();

        if (!$newsletter) {
            return response()->json(['message' => 'Email non trouvé'], 404);
        }

        $newsletter->update(['active' => false]);
        return response()->json(['message' => 'Désinscription réussie']);
    }
}
