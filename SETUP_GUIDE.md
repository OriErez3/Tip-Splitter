# Tip Splitter - Setup Guide

## What Was Added

### Frontend (Complete React Application)
A full-featured React frontend with:
- **Authentication**: Login and Registration pages with JWT token management
- **Dashboard**: View all your receipts in a clean, vertical layout
- **Receipt Cards**: Click on any person to see their itemized breakdown
- **Create Receipt**: Form to add new receipts with participants, appetizers, tax, and tip
- **Responsive Design**: Works on desktop and mobile

### Backend Changes
- Added CORS support to allow frontend-backend communication
- Installed `cors` package

## File Structure

```
Tip-Splitter/
├── Backend/
│   └── user-auth/
│       ├── app.js (✓ Updated with CORS)
│       └── ... (your existing backend)
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/          (Login, Register)
    │   │   ├── dashboard/     (Dashboard, ReceiptCard)
    │   │   ├── receipt/       (CreateReceipt, ParticipantInput)
    │   │   └── common/        (Navbar, PrivateRoute)
    │   ├── context/           (AuthContext)
    │   ├── services/          (API, auth, receipt services)
    │   ├── utils/             (split.js calculation)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## How to Run

### 1. Start the Backend

```bash
cd Backend/user-auth
node app.js
```

You should see:
```
Server running on port 3030
MongoDB connected
```

### 2. Start the Frontend (in a new terminal)

```bash
cd Frontend
npm run dev
```

You should see:
```
VITE v5.4.21  ready in 339 ms
➜  Local:   http://localhost:5173/
```

### 3. Open Your Browser

Navigate to: **http://localhost:5173**

## Using the Application

### First Time Setup
1. Click "Register here" on the login page
2. Create an account with username, email, and password
3. You'll be automatically logged in and redirected to the dashboard

### Creating a Receipt
1. Click "Create New Receipt" button
2. Enter receipt details:
   - Title (e.g., "Dinner at Restaurant")
   - Date
   - Appetizer subtotal (if any)
   - Tax amount
   - Tip amount
3. Add participants:
   - Name
   - Personal meal cost
   - Check "Include in appetizers" if they shared appetizers
4. Click "Create Receipt"

### Viewing Receipt Breakdown
1. On the dashboard, you'll see all your receipts vertically stacked
2. Each receipt shows:
   - Title and date at the top
   - Total amount in the top-right
   - List of people with their final amounts
3. **Click on any person's name** to see their itemized breakdown:
   - Meal Subtotal
   - Appetizer Share
   - Subtotal (before tax/tip)
   - Tax
   - Tip
   - Total

## Features

✅ User authentication with JWT tokens
✅ Create and save receipts
✅ Automatic tip/tax splitting calculation
✅ Per-person appetizer sharing (opt-in)
✅ Click-to-expand breakdown for each person
✅ Responsive design
✅ Clean, modern UI

## API Endpoints Used

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/recipts/mine` - Get all user's receipts
- `POST /api/recipts/` - Create new receipt

## Technologies

### Frontend
- React 18
- React Router v6
- Axios (HTTP client)
- Vite (build tool)
- CSS Modules (styling)

### Backend
- Express.js
- MongoDB + Mongoose
- JWT authentication
- CORS enabled

## Troubleshooting

### Frontend won't connect to backend
- Make sure backend is running on port 3030
- Check that CORS is enabled in `Backend/user-auth/app.js`
- Verify MongoDB is connected

### Can't create receipts
- Make sure you're logged in (check localStorage for token)
- Verify all form fields are filled out
- Check browser console for errors

### Port already in use
- Backend: Change `PORT` in `.env` or use default 3030
- Frontend: Vite will prompt you to use a different port if 5173 is taken

## Next Steps

You can now:
- Share this with friends and have them create accounts
- Create receipts for your group dinners
- Click on people's names to see how their totals were calculated
- Customize the styling in the CSS modules

Enjoy your Tip Splitter app! 🎉
