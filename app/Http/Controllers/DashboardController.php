<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role_id == 1) { // Admin
            $events = DB::table('events')
                ->join('event_categories', 'events.category_id', '=', 'event_categories.id')
                ->join('users', 'events.eo_id', '=', 'users.id')
                ->select('events.*', 'event_categories.name as category_name', 'users.name as eo_name')
                ->orderBy('events.created_at', 'desc')
                ->get();

            return Inertia::render('AdminDashboard', [
                'user' => $user,
                'events' => $events
            ]);
        } elseif ($user->role_id == 2) { // EO
            $events = DB::table('events')
                ->join('event_categories', 'events.category_id', '=', 'event_categories.id')
                ->select('events.*', 'event_categories.name as category_name')
                ->where('eo_id', $user->id)
                ->orderBy('events.created_at', 'desc')
                ->get();

            // Count applicants per event
            foreach ($events as $event) {
                $event->applicant_count = DB::table('applications')
                    ->where('event_id', $event->id)
                    ->count();
            }
                
            $categories = DB::table('event_categories')->get();

            return Inertia::render('EODashboard', [
                'user' => $user,
                'events' => $events,
                'categories' => $categories
            ]);
        } else {
            return redirect()->route('catalog');
        }
    }

    public function approveEvent($id)
    {
        $user = Auth::user();
        if ($user->role_id != 1) {
            abort(403, 'Unauthorized action.');
        }

        DB::table('events')->where('id', $id)->update(['status' => 'published']);

        return redirect()->back()->with('success', 'Event approved successfully.');
    }

    public function storeEvent(Request $request)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|integer',
            'location' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_paid' => 'required|boolean',
            'price' => 'nullable|integer|min:1000',
        ]);

        DB::table('events')->insert([
            'eo_id' => $user->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'location' => $request->location,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_paid' => $request->is_paid,
            'price' => $request->is_paid ? $request->price : null,
            'status' => 'draft',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Event created successfully and waiting for admin approval.');
    }

    /**
     * Show applicants for a specific event (EO only).
     */
    public function showApplicants($eventId)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        // Verify event belongs to this EO
        $event = DB::table('events')
            ->join('event_categories', 'events.category_id', '=', 'event_categories.id')
            ->select('events.*', 'event_categories.name as category_name')
            ->where('events.id', $eventId)
            ->where('events.eo_id', $user->id)
            ->first();

        if (!$event) {
            abort(404);
        }

        // Get all applicants for this event
        $applicants = DB::table('applications')
            ->join('users', 'applications.user_id', '=', 'users.id')
            ->join('event_divisions', 'applications.division_id', '=', 'event_divisions.id')
            ->select(
                'applications.*',
                'users.name as volunteer_name',
                'users.email as volunteer_email',
                'users.bio as volunteer_bio',
                'users.cv_path',
                'users.portfolio_url',
                'event_divisions.division_name'
            )
            ->where('applications.event_id', $eventId)
            ->orderBy('applications.created_at', 'desc')
            ->get();

        return Inertia::render('EOApplicants', [
            'user' => $user,
            'event' => $event,
            'applicants' => $applicants,
        ]);
    }

    /**
     * Update application status (accept/reject) by EO.
     */
    public function updateApplicationStatus(Request $request, $applicationId)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'status' => 'required|in:accepted,rejected',
        ]);

        // Verify the application belongs to an event owned by this EO
        $application = DB::table('applications')
            ->join('events', 'applications.event_id', '=', 'events.id')
            ->select('applications.*', 'events.eo_id', 'events.is_paid')
            ->where('applications.id', $applicationId)
            ->first();

        if (!$application || $application->eo_id != $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Only allow accept/reject when payment is settled
        if ($application->is_paid && !in_array($application->payment_status, ['paid', 'free'])) {
            return back()->withErrors(['status' => 'Cannot accept/reject applicant until payment is completed.']);
        }

        DB::table('applications')
            ->where('id', $applicationId)
            ->update([
                'status' => $request->status,
                'updated_at' => now(),
            ]);

        return redirect()->back()->with('success', 'Application status updated.');
    }
}
