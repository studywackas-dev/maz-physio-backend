# MAZ Physio Care & Surgicals — Full Stack Website
### Dr. Umer Farook | BPT, DOFSIM, MIAP | Ramanathapuram

---

## Project Structure
```
maz_physio_node/
├── server.js              ← Main entry point
├── package.json           ← Dependencies
├── .env.example           ← Rename to .env and fill values
├── index.html             ← Your frontend website
├── config/
│   ├── db.js              ← MongoDB connection
│   └── mailer.js          ← Email notifications
├── models/
│   ├── Appointment.js     ← Appointment data schema
│   ├── Contact.js         ← Contact message schema
│   └── Admin.js           ← Admin user schema
├── controllers/
│   ├── appointmentController.js
│   ├── contactController.js
│   └── adminController.js
├── routes/
│   └── index.js           ← All API routes
└── middleware/
    └── auth.js            ← JWT authentication
```

---

## Step-by-Step Setup

### Step 1 — Install Node.js
Download from https://nodejs.org (LTS version)

### Step 2 — Get Free MongoDB
1. Go to https://mongodb.com
2. Create free account → New Project → Free Cluster
3. Click Connect → Get connection string
4. Copy the string (looks like: mongodb+srv://...)

### Step 3 — Setup Gmail for Email Notifications
1. Go to your Gmail → Settings → Security
2. Enable 2-Step Verification
3. Search "App Passwords" → Create one for "Mail"
4. Copy the 16-character password

### Step 4 — Configure Environment
```bash
# Rename .env.example to .env
# Fill in your MongoDB URI, Gmail details
```

### Step 5 — Install & Run
```bash
npm install
npm run dev
```
You should see:
```
✅ MongoDB Connected
🚀 MAZ Physio Backend running on port 5000
```

### Step 6 — Create Admin Account (first time only)
Open browser and go to:
```
POST http://localhost:5000/api/admin/setup
```
Or use this command:
```bash
curl -X POST http://localhost:5000/api/admin/setup
```

### Step 7 — Test It
Open index.html in browser, fill the appointment form and submit.
You should receive an email at physioumer@gmail.com!

---

## API Endpoints

| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | /api/appointments | Public | Book appointment |
| POST | /api/contact | Public | Send message |
| POST | /api/admin/login | Public | Admin login |
| GET | /api/appointments | Admin | All appointments |
| GET | /api/appointments/today | Admin | Today's list |
| PATCH | /api/appointments/:id | Admin | Update status |
| DELETE | /api/appointments/:id | Admin | Delete |
| GET | /api/contact | Admin | All messages |

---

## Default Admin Login
- Username: `admin`
- Password: `maz@2025`
- **Change this after first login!**

---

## Deploying Online (Free)

### Backend → Render.com (Free)
1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect your GitHub repo
4. Set environment variables (same as .env)
5. Deploy → get your URL like: https://maz-physio.onrender.com

### Frontend → Update API_URL
In index.html, change:
```js
const API_URL = 'http://localhost:5000/api';
// to:
const API_URL = 'https://maz-physio.onrender.com/api';
```

---

## Clinic Details
- **Clinic:** MAZ Physio Care & Surgicals
- **Doctor:** Dr. Umer Farook (BPT, DOFSIM, MIAP)
- **Phone:** 7448858968 / 9150758968
- **Email:** physioumer@gmail.com
- **Address:** No. 6, Lodge Building, Ramanathapuram – 623504
