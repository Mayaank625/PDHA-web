# PDHO Platform – Pune District Handball Organisation

An elegant, fully-featured management and public portal for the **Pune District Handball Organisation (PDHO)**. Built as a high-performance, responsive web application using Next.js, Tailwind CSS, Base UI, MongoDB, and NextAuth.

---

## 🌟 Core Features

### 1. Public Portal
* **Dynamic Homepage**: Features customizable organization branding, dynamic hero headers, real-time announcements, and highlight sections for featured tournaments.
* **Player & Team Registration**: Fully validated, user-friendly registration forms with robust client-side validation (using React Hook Form and Zod) for:
  * **Individual Players**: Age, gender, position, and contact details.
  * **Teams**: Category, manager details, and contact credentials.
* **Tournaments Hub**: Real-time status tags (**Upcoming**, **Ongoing**, **Completed**), venue maps, dynamic schedules, and tournament brackets.
* **Matches & Live Schedules**: Search and filter upcoming match details and review historical match results.
* **Interactive Media Gallery**: Grid layout showcasing media and photo highlights from district matches.
* **Contact Center**: Secure validation portal allowing visitors to submit inquiries or suggestions directly to the administration.

### 2. Admin Dashboard (Protected Portal)
Secure, role-based access dashboard allowing authorized personnel (`Admin` or `SuperAdmin`) to manage the platform:
* **Registrations Management**: Live view of pending registrations where admins can review, filter, and approve/reject player and team applications.
* **Tournament Manager**: Complete CRUD dashboard to create, update, and manage handball tournaments.
* **Site Settings Dashboard**: Dynamically update organization details, contact information, logos, and custom Hero banners without writing code.

---

## 🛠️ Administrative & CLI Commands

### 1. Database Seeding (Add First Admin User)
Because the Admin Dashboard is protected by NextAuth credentials, you must seed the initial administrative user directly into your database.

To do this automatically, run the custom administrative seeding command:
```bash
node scripts/seed-admin.js "<your-mongodb-connection-string>"
```
*Note: If no connection string is passed, the script will automatically fallback to the `MONGODB_URI` environment variable defined in your local `.env.local`.*

**Initial SuperAdmin Credentials:**
* **Email:** `admin@pdho.org`
* **Password:** `password123` *(Remember to update this in the dashboard or MongoDB after logging in)*

### 2. Development Commands
Install dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```
The server will start at [http://localhost:3000](http://localhost:3000).

### 3. Production Commands
Build the optimized application for production:
```bash
npm run build
```

Run the built production server locally:
```bash
npm run start
```

---

## 🚀 Deployment Guide (Vercel & MongoDB Atlas)

### Step 1: Set Up MongoDB Atlas
1. Register/Login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a free **M0 cluster** database.
3. In **Security** -> **Database Access**, create a user with **Read and write to any database** privilege.
4. In **Network Access**, add IP `0.0.0.0/0` (required for Vercel's dynamic IP system).
5. Copy your application connection string (driver-level) and insert your password.

### Step 2: Seed your Production Database
Seed your newly created Atlas DB by running:
```bash
node scripts/seed-admin.js "mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/pdho?retryWrites=true&w=majority"
```

### Step 3: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Select **Add New** -> **Project** and import your `PDHA-web` repository.
3. Expand **Environment Variables** and add:
   * `MONGODB_URI` – *Your MongoDB Atlas connection string.*
   * `NEXTAUTH_SECRET` – *A secure, random 32-character string.*
4. Click **Deploy**.
