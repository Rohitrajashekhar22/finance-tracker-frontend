# Finance Tracker Frontend - Complete Setup

## ✅ Project Overview

A complete React Vite frontend for a Finance Tracker application with JWT authentication, role-based access control, and transaction management.

**Tech Stack:**
- React 19.2.4 (Vite)
- Tailwind CSS 4.2.2
- Axios for API calls
- React Router DOM for routing
- JWT Decode for token parsing

**API Base URL:** `http://localhost:5000/api`

---

## 🗂️ Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   └── Navbar.jsx                 # Navigation with role-based display
│   ├── pages/
│   │   ├── Login.jsx                  # JWT login & token storage
│   │   ├── Dashboard.jsx              # Summary stats & recent transactions
│   │   ├── Transactions.jsx           # List all transactions with filters
│   │   └── AddTransaction.jsx         # Create/Edit transaction form
│   ├── services/
│   │   └── api.js                     # Axios instance with interceptors
│   ├── App.jsx                        # React Router setup
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Tailwind imports
├── package.json                       # Dependencies & scripts
├── vite.config.js                     # Vite configuration
├── tailwind.config.js                 # Tailwind configuration
└── eslint.config.js                   # ESLint rules
```

---

## 🔐 Authentication Flow

### Login Process
1. User enters email & password on `/login` page
2. Request sent to `POST /login`
3. Backend returns `{ token }`
4. Token stored in `localStorage`
5. Token decoded using `jwt-decode` to extract:
   - `userId`
   - `role` (viewer, analyst, admin)
6. User redirected to `/` (Dashboard)

### Token Management
- **Stored in:** `localStorage` as `token`
- **Sent in all requests:** `Authorization: Bearer {token}`
- **Auto-attached via Axios interceptor** (see `services/api.js`)
- **Auto-logout:** 401 responses trigger redirect to `/login`

---

## 👥 Role-Based Access Control

### Viewer
- ✅ View dashboard & summary stats
- ✅ View all transactions
- ❌ Cannot create/edit/delete

### Analyst
- ✅ View all dashboard data
- ✅ View transactions
- ✅ Create transactions
- ✅ Edit own transactions
- ❌ Cannot delete

### Admin
- ✅ Full access to all features
- ✅ Can create, edit, delete transactions
- ✅ Can manage all user data

**UI automatically hides/shows buttons based on role.**

---

## 🌐 API Service Layer (`services/api.js`)

### Axios Instance
```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});
```

### Request Interceptor
Automatically adds token to every request:
```javascript
Authorization: Bearer {token}
```

### Response Interceptor
Handles 401 errors → redirects to `/login`

### Available Endpoints

**Auth**
```javascript
authAPI.login(email, password)
authAPI.register(email, password, name)
```

**Transactions**
```javascript
transactionAPI.getAll()                    // GET /transactions
transactionAPI.create(data)                // POST /transactions
transactionAPI.update(id, data)            // PUT /transactions/{id}
transactionAPI.delete(id)                  // DELETE /transactions/{id}
```

**Dashboard**
```javascript
dashboardAPI.getSummary()                  // GET /dashboard/summary
```

---

## 📄 Page Components

### 1. **Login Page** (`pages/Login.jsx`)
- Email & password input fields
- Stores token in localStorage
- Decodes JWT to extract userId & role
- Redirects to Dashboard on success
- Error handling with user feedback

**Route:** `/login`

### 2. **Dashboard Page** (`pages/Dashboard.jsx`)
- Displays summary cards:
  - Total Income (green)
  - Total Expense (red)
  - Balance (blue)
- Shows last 5 recent transactions
- Fetches from `GET /dashboard/summary`
- Protected route (requires token)

**Route:** `/`

### 3. **Transactions Page** (`pages/Transactions.jsx`)
- Lists all transactions in a table
- Displays: Category, Type, Amount, Date, Note
- Edit button (visible to analyst & admin)
- Delete button (visible to admin only)
- Delete confirmation dialog
- Empty state message
- Protected route

**Route:** `/transactions`

### 4. **Add/Edit Transaction** (`pages/AddTransaction.jsx`)
- Form with fields:
  - Amount (required)
  - Type (income/expense)
  - Category (dynamic based on type)
  - Date (default: today)
  - Note
- Dynamic categories:
  - **Income:** Salary, Freelance, Investment, Other
  - **Expense:** Food, Transport, Entertainment, Utilities, Shopping, Health, Education, Other
- Supports both create & edit (via URL param `?edit={id}`)
- Restricted to analyst & admin (viewers redirected)
- Form validation & error handling

**Route:** `/add`

### 5. **Navbar Component** (`components/Navbar.jsx`)
- Logo with link to dashboard
- Navigation links:
  - Dashboard
  - Transactions
  - Add Transaction (analyst & admin only)
- User role display
- Logout button
- Mobile responsive menu
- Active link highlighting
- Only shows when logged in

---

## 🎨 Design System

### Colors
- **Primary:** Blue (`#2563eb`)
- **Success:** Green (`#16a34a`)
- **Error/Expense:** Red (`#dc2626`)
- **Neutral:** Gray shades

### Components
- Cards with shadow & rounded corners
- Responsive tables
- Form controls with focus states
- Loading spinners
- Error messages (red background)
- Success messages (green background)
- Badge badges for transaction types
- Tailwind utility classes throughout

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Grid layouts that adapt
- All pages fully responsive

---

## 🚀 Running the Frontend

### Development Server
```bash
cd Frontend
npm install
npm run dev
```
Starts on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm lint
```

---

## 🔄 API Integration Details

### Expected Response Formats

**Login Response**
```json
{
  "token": "eyJhbGc..."
}
```

**Dashboard Summary**
```json
{
  "totalIncome": 50000,
  "totalExpense": 20000,
  "balance": 30000
}
```

**Transactions List**
```json
{
  "transactions": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "amount": 1000,
      "type": "expense",
      "category": "Food",
      "date": "2024-01-15",
      "note": "Groceries"
    }
  ]
}
```

---

## ⚡ Key Features

✅ **JWT Authentication** - Secure token-based auth
✅ **Role-Based UI** - Dynamic button/link visibility
✅ **Auto Token Injection** - Axios interceptor handles tokens
✅ **Error Handling** - User-friendly error messages
✅ **Form Validation** - Required fields enforcement
✅ **Responsive Design** - Mobile-first Tailwind CSS
✅ **Loading States** - Spinners for async operations
✅ **Edit Mode** - Query params to support editing
✅ **Delete Confirmation** - Safety confirmation before delete
✅ **Time Formatting** - Automatic date formatting

---

## 🐛 Troubleshooting

### Issue: "Failed to login"
- Verify backend is running on `http://localhost:5000`
- Check email & password are correct
- Check backend logs for errors

### Issue: "401 Unauthorized"
- Token may have expired
- localStorage may be cleared
- Backend may not recognize token format
- Check `Authorization` header is being sent correctly

### Issue: Cannot see "Add Transaction" button
- Check your role (must be analyst or admin)
- Check token is properly stored in localStorage
- Check browser DevTools → Application → Storage

### Issue: Transactions not loading
- Verify backend `/transactions` endpoint works
- Check network requests in DevTools
- Verify token is being sent
- Check MongoDB connection on backend

### Issue: Form submission fails
- Ensure all required fields are filled
- Check backend response format matches expected
- Check browser console for errors
- Verify category is valid for selected type

---

## 📚 Dependencies

```json
{
  "axios": "^1.14.0",              // HTTP client
  "jwt-decode": "^4.0.0",         // JWT parsing
  "react": "^19.2.4",             // UI library
  "react-dom": "^19.2.4",         // React DOM
  "react-router-dom": "^7.14.0"   // Routing
}
```

DevDependencies include Vite, Tailwind CSS, ESLint, and related tools.

---

## 🔗 Backend API Endpoints (Reference)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/login` | `{ email, password }` | `{ token }` |
| POST | `/register` | `{ email, password, name }` | User object |
| GET | `/dashboard/summary` | - | `{ totalIncome, totalExpense, balance }` |
| GET | `/transactions` | - | `{ transactions: [] }` |
| POST | `/transactions` | Transaction data | Created transaction |
| PUT | `/transactions/:id` | Transaction data | Updated transaction |
| DELETE | `/transactions/:id` | - | Success message |

---

## ✨ Next Steps

1. Ensure backend is running on `http://localhost:5000`
2. Start frontend: `npm run dev`
3. Open `http://localhost:5173` in browser
4. Test login with backend credentials
5. Navigate through dashboard, transactions, and add new transactions
6. Verify role-based access control works

---

**Created:** April 6, 2026
**Status:** ✅ Complete & Tested
