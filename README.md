# Agriculture Management System (AMS)

Full-stack project per spec:
- Backend: Node.js (Express) + Sequelize + SQLite
- Frontend: React (Vite), React Router
- Auth: JWT with role-based access (`admin`, `farmer`, `shop`)

## 🪟 Windows Users - Quick Start

**Easiest Way:**
1. Install Node.js from https://nodejs.org/ (LTS version)
2. Double-click `run.bat` file
3. Wait for setup to complete
4. Browser opens automatically at http://localhost:5173

**Need Help?** See `README_WINDOWS.md` or `QUICK_START_WINDOWS.txt` for detailed instructions.

**Other Files:**
- `stop.bat` - Stop all servers
- `setup.bat` - First-time setup only

---

## 🍎 Mac/Linux Users - Quickstart

### 1) Backend Setup
```bash
cd backend
npm install
# Create .env file
cat > .env << 'EOF'
PORT=4000
JWT_SECRET=change_me
EOF
# Create database tables
npm run sync
# Start backend server
npm start
```

### 2) Frontend Setup (in new terminal)
```bash
cd frontend
npm install
# Optionally set API URL
echo "VITE_API_URL=http://localhost:4000/api" > .env
npm run dev
```

### 3) Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api

**That's it! No MySQL setup needed - uses SQLite database file.**

## Structure
```
backend/
  controllers/
  middleware/
  models/
  routes/
  scripts/
  app.js
frontend/
  src/
    components/
    pages/
    services/
    App.js
database.sql
```

## API Highlights
- `POST /api/auth/register` — register user (role: admin/farmer/shop)
- `POST /api/auth/login` — login, returns JWT
- CRUD routes under `/api/users`, `/api/farmers`, `/api/shops`, `/api/products`, `/api/purchases`, `/api/crops`, `/api/reports`
- Reports examples:
  - `/api/reports/metrics/total-products-sold`
  - `/api/reports/metrics/farmer-purchases`

## Notes
- For production, set strong `JWT_SECRET` and proper DB credentials.
