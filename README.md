# Tip Splitter (MERN)

A full-stack web app that helps groups split restaurant receipts by **individual meal totals**, **shared appetizers**, **tax**, and **tip** — with user accounts so you can save and view past receipts.

## Live Demo
- Frontend (Vercel): ori-tip-splitter.vercel.app
- Backend API (Render): https://tip-splitter.onrender.com

---

## Features
- User authentication (register/login) with JWT
- Create receipts with:
  - Participant name + meal subtotal
  - Checkbox to include/exclude each person from appetizer split
  - Appetizer subtotal, tax %, tip %
- Automatic per-person total calculation
- Save receipts to MongoDB and view receipt history by user
- Protected routes (users can only access their own receipts)

---

## Tech Stack
**Frontend**
- React (Vite)
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Auth

**Deployment**
- Vercel (frontend)
- Render (backend)
- MongoDB Atlas (database)

---

## How Splitting Works
Given:
- Each participant’s `mealSubtotal`
- `appetizerSubtotal`
- `taxRate` and `tipRate` (taxRate is in USD, tipRate is percentage)
- `includeApps` checkbox per participant

Algorithm:
1. Compute `appsShare = appetizerSubtotal / (# participants with includeApps=true)` (0 if none checked)
2. For each participant:
   - `base = mealSubtotal + (includeApps ? appsShare : 0)`
   - `tax = base * taxRate`
   - `tip = base * tipRate`
   - `total = base + tax + tip`
3. Round totals to 2 decimals for display

---

## Project Structure (example)
