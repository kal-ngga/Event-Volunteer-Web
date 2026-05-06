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

            // Count applicants per event + collect app details
            $allApplications = collect();
            foreach ($events as $event) {
                $apps = DB::table('applications')
                    ->where('event_id', $event->id)
                    ->get();
                $event->applicant_count = $apps->count();
                $event->accepted_count = $apps->where('status', 'accepted')->count();
                $event->rejected_count = $apps->where('status', 'rejected')->count();
                $event->pending_count = $apps->where('status', 'pending')->count();
                $event->revenue = $event->is_paid
                    ? $apps->whereIn('payment_status', ['paid'])->count() * ($event->price ?? 0)
                    : 0;
                $allApplications = $allApplications->merge($apps);
            }

            // Summary stats
            $totalApplicants = $allApplications->count();
            $totalAccepted = $allApplications->where('status', 'accepted')->count();
            $totalRejected = $allApplications->where('status', 'rejected')->count();
            $totalPending = $allApplications->where('status', 'pending')->count();
            $totalRevenue = $events->sum('revenue');
            $totalEvents = $events->count();
            $publishedEvents = $events->where('status', 'published')->count();

            // Monthly applicant data (last 6 months) for chart
            $monthlyData = [];
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $monthLabel = $date->translatedFormat('M Y');
                $startOfMonth = $date->copy()->startOfMonth();
                $endOfMonth = $date->copy()->endOfMonth();

                $monthApplicants = $allApplications->filter(function ($app) use ($startOfMonth, $endOfMonth) {
                    $createdAt = \Carbon\Carbon::parse($app->created_at);
                    return $createdAt->between($startOfMonth, $endOfMonth);
                })->count();

                $monthRevenue = 0;
                foreach ($events as $event) {
                    if ($event->is_paid) {
                        $monthRevenue += DB::table('applications')
                            ->where('event_id', $event->id)
                            ->where('payment_status', 'paid')
                            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                            ->count() * ($event->price ?? 0);
                    }
                }

                $monthlyData[] = [
                    'month' => $monthLabel,
                    'applicants' => $monthApplicants,
                    'revenue' => $monthRevenue,
                ];
            }

            // Recent transactions (latest paid applications across all EO events)
            $eventIds = $events->pluck('id')->toArray();
            $recentTransactions = DB::table('applications')
                ->join('users', 'applications.user_id', '=', 'users.id')
                ->join('events', 'applications.event_id', '=', 'events.id')
                ->select(
                    'applications.*',
                    'users.name as volunteer_name',
                    'users.email as volunteer_email',
                    'events.title as event_title',
                    'events.price as event_price',
                    'events.is_paid as event_is_paid'
                )
                ->whereIn('applications.event_id', $eventIds)
                ->orderBy('applications.created_at', 'desc')
                ->limit(10)
                ->get();

            $categories = DB::table('event_categories')->get();

            return Inertia::render('EODashboard', [
                'user' => $user,
                'events' => $events,
                'categories' => $categories,
                'stats' => [
                    'totalApplicants' => $totalApplicants,
                    'totalAccepted' => $totalAccepted,
                    'totalRejected' => $totalRejected,
                    'totalPending' => $totalPending,
                    'totalRevenue' => $totalRevenue,
                    'totalEvents' => $totalEvents,
                    'publishedEvents' => $publishedEvents,
                ],
                'allApplications' => $allApplications,
                'monthlyData' => $monthlyData,
                'recentTransactions' => $recentTransactions,
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

    public function createEvent()
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $categories = DB::table('event_categories')->get();

        return Inertia::render('EOCreateEvent', [
            'user' => $user,
            'categories' => $categories,
        ]);
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
            'description' => 'required|string',
            'activity_details' => 'required|string',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images'), $filename);
            $imagePath = 'images/' . $filename;
        }

        $eventId = DB::table('events')->insertGetId([
            'eo_id' => $user->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'location' => $request->location,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_paid' => $request->is_paid,
            'price' => $request->is_paid ? $request->price : null,
            'image_path' => $imagePath,
            'status' => 'published',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('event_details')->insert([
            'event_id' => $eventId,
            'description' => $request->description,
            'activity_details' => $request->activity_details,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Event created successfully and waiting for admin approval.');
    }

    public function manageEvent($id)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $event = DB::table('events')
            ->leftJoin('event_details', 'events.id', '=', 'event_details.event_id')
            ->select('events.*', 'event_details.description', 'event_details.activity_details')
            ->where('events.id', $id)
            ->where('events.eo_id', $user->id)
            ->first();

        if (!$event) {
            abort(404);
        }

        $divisions = DB::table('event_divisions')
            ->where('event_id', $id)
            ->get();

        $categories = DB::table('event_categories')->get();

        return Inertia::render('EOManageEvent', [
            'user' => $user,
            'event' => $event,
            'divisions' => $divisions,
            'categories' => $categories,
        ]);
    }

    public function updateEvent(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $event = DB::table('events')->where('id', $id)->where('eo_id', $user->id)->first();
        if (!$event) {
            abort(404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|integer',
            'location' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_paid' => 'required|boolean',
            'price' => 'nullable|integer|min:1000',
            'description' => 'nullable|string',
            'activity_details' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $updateData = [
            'category_id' => $request->category_id,
            'title' => $request->title,
            'location' => $request->location,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_paid' => $request->is_paid,
            'price' => $request->is_paid ? $request->price : null,
            'updated_at' => now(),
        ];

        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images'), $filename);
            $updateData['image_path'] = 'images/' . $filename;
        }

        DB::table('events')->where('id', $id)->update($updateData);

        DB::table('event_details')->updateOrInsert(
            ['event_id' => $id],
            [
                'description' => $request->description ?? '',
                'activity_details' => $request->activity_details ?? '',
                'updated_at' => now(),
            ]
        );

        return redirect()->back()->with('success', 'Event updated successfully.');
    }

    public function storeDivision(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $event = DB::table('events')->where('id', $id)->where('eo_id', $user->id)->first();
        if (!$event) {
            abort(404);
        }

        $request->validate([
            'division_name' => 'required|string|max:255',
            'quota' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        DB::table('event_divisions')->insert([
            'event_id' => $id,
            'division_name' => $request->division_name,
            'quota' => $request->quota,
            'description' => $request->description,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Division added successfully.');
    }

    public function updateDivision(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $division = DB::table('event_divisions')->where('id', $id)->first();
        if (!$division) {
            abort(404);
        }

        // Verify that the event belongs to the EO
        $event = DB::table('events')->where('id', $division->event_id)->where('eo_id', $user->id)->first();
        if (!$event) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'division_name' => 'required|string|max:255',
            'quota' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ]);

        DB::table('event_divisions')->where('id', $id)->update([
            'division_name' => $request->division_name,
            'quota' => $request->quota,
            'description' => $request->description,
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Division updated successfully.');
    }

    public function destroyDivision($id)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $division = DB::table('event_divisions')->where('id', $id)->first();
        if (!$division) {
            abort(404);
        }

        // Verify that the event belongs to the EO
        $event = DB::table('events')->where('id', $division->event_id)->where('eo_id', $user->id)->first();
        if (!$event) {
            abort(403, 'Unauthorized action.');
        }

        // Check if there are existing applications for this division
        $applicationsCount = DB::table('applications')->where('division_id', $id)->count();
        if ($applicationsCount > 0) {
            return redirect()->back()->withErrors(['error' => 'Cannot delete division because there are already applicants.']);
        }

        DB::table('event_divisions')->where('id', $id)->delete();

        return redirect()->back()->with('success', 'Division deleted successfully.');
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

        // Get event title for the notification message
        $event = DB::table('events')->where('id', $application->event_id)->first();
        $eventTitle = $event ? $event->title : 'sebuah event';

        // Create notification for the volunteer
        $statusLabel = $request->status === 'accepted' ? 'Diterima' : 'Ditolak';
        DB::table('notifications')->insert([
            'user_id' => $application->user_id,
            'title' => "Lamaran {$statusLabel}!",
            'message' => $request->status === 'accepted'
                ? "Selamat! Lamaran kamu untuk \"{$eventTitle}\" telah diterima. Terima kasih telah bergabung sebagai relawan!"
                : "Mohon maaf, lamaran kamu untuk \"{$eventTitle}\" belum bisa diterima saat ini. Jangan menyerah, masih banyak kesempatan lainnya!",
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Application status updated.');
    }

    public function closeEvent($id)
    {
        $user = Auth::user();
        if ($user->role_id != 2) {
            abort(403, 'Unauthorized action.');
        }

        $event = DB::table('events')->where('id', $id)->first();
        if (!$event || $event->eo_id != $user->id) {
            abort(403, 'Unauthorized action.');
        }

        DB::table('events')->where('id', $id)->update(['status' => 'closed', 'updated_at' => now()]);

        return redirect()->back()->with('success', 'Pendaftaran event berhasil ditutup.');
    }
}
