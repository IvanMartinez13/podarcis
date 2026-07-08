<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function privacy(): Response
    {
        return Inertia::render('legal/privacy');
    }

    public function cookies(): Response
    {
        return Inertia::render('legal/cookies');
    }
}
