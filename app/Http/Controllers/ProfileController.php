<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get user's event application history
        $applications = DB::table('applications')
            ->join('events', 'applications.event_id', '=', 'events.id')
            ->join('event_divisions', 'applications.division_id', '=', 'event_divisions.id')
            ->select(
                'applications.*',
                'events.title as event_title',
                'events.start_date',
                'events.location',
                'event_divisions.division_name'
            )
            ->where('applications.user_id', $user->id)
            ->orderBy('applications.created_at', 'desc')
            ->get();

        return Inertia::render('VolunteerProfile', [
            'user' => $user,
            'applications' => $applications
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'portfolio_url' => 'nullable|url|max:255',
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:2048', // Allow PDF, DOC, DOCX up to 2MB
        ]);

        $updateData = [
            'name' => $request->name,
            'bio' => $request->bio,
            'portfolio_url' => $request->portfolio_url,
            'updated_at' => now(),
        ];

        if ($request->hasFile('cv_file')) {
            // Delete old CV if exists
            if ($user->cv_path) {
                Storage::disk('public')->delete($user->cv_path);
            }

            // Store newly uploaded CV
            $path = $request->file('cv_file')->store('cvs', 'public');
            $updateData['cv_path'] = $path;
        }

        DB::table('users')->where('id', $user->id)->update($updateData);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }
}
