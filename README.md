# Voluntree

Voluntree is a comprehensive web-based platform built with Laravel, React (via Inertia.js), and Tailwind CSS designed to bridge the gap between Event Organizers (EO) and Volunteers. It simplifies the process of event publishing, volunteer recruitment, profile management, and payment processing for paid volunteer events.

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white) 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white) 
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Midtrans](https://img.shields.io/badge/Midtrans-000000?style=for-the-badge)

## Key Features

### 1. Multi-Role Architecture
The system supports three distinct user roles with dedicated interfaces and permissions:
- **Admin**: Oversees the entire platform. Approves/rejects event drafts published by Event Organizers.
- **Event Organizer (EO)**: Creates new events (free or paid), manages event divisions/quotas, and reviews volunteer applicants.
- **Volunteer**: Browses the event catalog, manages their interactive profile (Bio, CV, Portfolio), and applies to events.

### 2. Integrated Payment Gateway (Midtrans)
For events that require registration fees, Voluntree is fully integrated with **Midtrans**:
- **Snap Token Popup**: Volunteers can instantly securely pay via GoPay, QRIS, Bank Transfers, etc. within the application without being redirected.
- **Automated Webhooks**: Background integration automatically verifies real-time payment success (Settlement) and updates the application status to `Paid`.
- **Cancellation**: Volunteers can seamlessly cancel applications stuck in the `Pending payment` status without database locking issues.

### 3. Advanced Applicant Tracking & Management
Event Organizers have access to a rich CRM-like dashboard for their events:
- View comprehensive applicant profiles including dynamically generated avatars, background bios, downloaded CVs, and Portfolio links.
- Interactive **Accept/Reject** workflows ensuring only volunteers who have settled their payments can be evaluated.

### 4. Volunteer Dashboard & Profiles
Volunteers have their own personalized hub to:
- Track the status of their event applications (e.g. *Menunggu Review*, *Diterima*, *Ditolak*).
- Upload and manage resumes/CV files natively hosted on the server.
- Present their portfolios to stand out for elite events.

## Tech Stack

- **Backend Context:** [Laravel 11.x](https://laravel.com/)
- **Frontend Engine:** [React 18](https://reactjs.org/) + [Inertia.js](https://inertiajs.com/)
- **Styling UI:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** MySQL
- **Payments:** Midtrans API SDK

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & npm
- MySQL

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd web-volunteer
   ```

2. **Install PHP and Node dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup:**
   Copy the example `.env` file and generate a Laravel application key.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database configuration:**
   Open `.env` and adjust the database environment variables to match your local MySQL configuration:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password
   ```

5. **Midtrans Configuration:**
   Add your Midtrans API credentials (from your Midtrans Sandbox account) to the `.env` file:
   ```env
   MIDTRANS_MERCHANT_ID=your_merchant_id
   MIDTRANS_CLIENT_KEY=your_client_key
   MIDTRANS_SERVER_KEY=your_server_key
   MIDTRANS_IS_PRODUCTION=false
   ```

6. **Run Migrations & Link Storage:**
   Initialize the database schema and expose the local storage for CV uploads to the public directory:
   ```bash
   php artisan migrate
   php artisan storage:link
   ```

7. **Compile Frontend & Start Server:**
   You will need to run two terminal processes simultaneously.
   
   To compile React assets via Vite:
   ```bash
   npm run dev
   ```

   To spin up the local Laravel PHP server:
   ```bash
   php artisan serve
   ```

8. *(Optional)* **Webhook Tunnelling:**
   If you wish to test the end-to-end Midtrans payment flow on localhost, run Ngrok to tunnel your local server and place the Ngrok URL into your Midtrans Dashboard Webhook settings (`/api/midtrans-callback`):
   ```bash
   ngrok http 8000
   ```

## License
This application is open-source software licensed under the MIT license.
