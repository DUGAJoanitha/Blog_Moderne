<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function index()
    {
        $subscribers = Newsletter::orderByDesc('created_at')->get();
        return response()->json($subscribers);
    }

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

    public function toggle(Newsletter $newsletter)
    {
        $newsletter->update(['active' => !$newsletter->active]);
        return response()->json([
            'message' => $newsletter->active ? 'Abonné réactivé' : 'Abonné désactivé',
            'data'    => $newsletter,
        ]);
    }

    public function destroy(Newsletter $newsletter)
    {
        $newsletter->delete();
        return response()->json(['message' => 'Abonné supprimé']);
    }
}
