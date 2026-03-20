# 🎯 HRMS Frontend (React.js)

A modern **HR Management System Frontend** built with:

* ⚛️ React.js
* 🔐 JWT Authentication + Refresh Token
* 🔑 Role-Based Access Control (RBAC)
* 📊 Dashboard (Employees, Payroll, Attendance, Tasks)
* 📦 Axios API Integration
* 🎨 Custom CSS UI

---

# 🏗️ Tech Stack

* React.js
* React Router DOM
* Axios
* Context API (Auth)
* CSS (Custom)
* Drag & Drop (`@hello-pangea/dnd`)

---

# 📦 Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone <your-frontend-repo>
cd hrms-frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Environment Setup

Create `.env` file in root:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 4️⃣ Run Application

```bash
npm run dev
```

App will run at:

```bash
http://localhost:5173
```

---

# 🔐 Authentication Flow

### Login API

```http
POST /auth/login
```

### Response

```json
{
  "accessToken": "token",
  "user": {
    "id": 1,
    "roleId": 3
  }
}
```

---

### Frontend Handling

```js
localStorage.setItem("accessToken", token);
localStorage.setItem("user", JSON.stringify(user));
```

---

### Axios Setup

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### Refresh Token Flow

* If accessToken expires:

```http
POST /auth/refresh
```

* Get new token → continue without logout

---

# 🔑 RBAC (Role-Based Access Control)

| Role     | ID |
| -------- | -- |
| Admin    | 1  |
| HR       | 3  |
| Manager  | 4  |
| Employee | 5  |

---

### Example

```js
hasPermission(user, "employee", "create")
```

---

### Protected Route

```jsx
<ProtectedRoute module="employee" action="view">
  <EmployeeList />
</ProtectedRoute>
```

---

# 📊 Features / Modules

---

## 🧑‍💼 Employees

* View employees
* Create / Update / Delete
* Role-based actions

---

## 🏢 Departments

* Create / Update / Delete
* Only Admin / HR access

---

## 📅 Attendance

### Employee:

* Check In
* Check Out

### HR / Manager:

* Mark attendance (present/absent)

### Monthly Report:

```http
GET /attendance?month=3&year=2026
```

---

## 💰 Payroll

### Generate Payroll (HR/Admin)

```http
POST /payroll/generate
```

### View Payroll

```http
GET /payroll/view
```

### Download Payslip (PDF)

```http
GET /payroll/payslip/:id
```

---

## 📋 Tasks (Kanban Board)

* Drag & Drop tasks
* Status:

  * todo
  * in_progress
  * completed

### Role:

* HR/Manager → Create Task
* Employee → Update own task

---

# 📁 Folder Structure

```bash
src/
 ├── components/
 ├── pages/
 ├── services/
 ├── context/
 ├── utils/
 ├── styles/
 ├── routes/
```

---

# ⚙️ API Base URL

```js
http://localhost:5001/api
```

---

# 🛠️ Common Issues

---

## ❌ API not working

✔ Check backend is running
✔ Check correct API URL

---

## ❌ Token expired → logout

✔ Implement refresh token logic

---

## ❌ Drag & Drop not working

✔ Ensure `draggableId` is string
✔ Do not block drag with conditions

---

## ❌ Payroll not showing

✔ Generate payroll first
✔ Ensure employee has salary

---

# 🚀 Build for Production

```bash
npm run build
```

Output:

```bash
dist/
```

---

# 🌍 Deployment Options

* Vercel
* Netlify
* AWS S3
* Nginx

---

# 👨‍💻 Author

Prince Raj 🚀

---

---
