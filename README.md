# 🚀 HRMS Backend (Node.js + MySQL + Docker)

A complete **HR Management System (HRMS)** backend with:

* 🔐 Authentication (JWT + Refresh Token)
* 🧑‍💼 Employee Management
* 🏢 Department Management
* 📅 Attendance System
* 📝 Leave Management
* 💰 Payroll + Payslip (PDF using Puppeteer)
* 📋 Task Management (Kanban Board)
* 🔑 RBAC (Role-Based Access Control)

---

# 🏗️ Tech Stack

* Node.js + Express
* MySQL
* Redis (optional for caching)
* Puppeteer (PDF generation)
* Docker + Docker Compose
* Swagger (API Docs)

---

# 📦 Project Setup (Without Docker)

## 1️⃣ Clone Repo

```bash
git clone <your-repo-url>
cd hrms-backend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Setup Environment

Create `.env` file:

```env
PORT=5001

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hrms_db

JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

REDIS_HOST=localhost
REDIS_PORT=6379
```

## 4️⃣ Run Database

Import SQL schema (you already created tables)

```bash
mysql -u root -p hrms_db < schema.sql
```

## 5️⃣ Run Server

```bash
npm run dev
```

---

# 🐳 Docker Setup (RECOMMENDED)

## 📁 Create `docker-compose.yml`

```yaml
version: "3.8"

services:
  app:
    build: .
    container_name: hrms_app
    ports:
      - "5001:5001"
    depends_on:
      - mysql
      - redis
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=root
      - DB_NAME=hrms_db
      - JWT_SECRET=secret
      - REFRESH_TOKEN_SECRET=refreshsecret
    volumes:
      - .:/app
    command: npm run dev

  mysql:
    image: mysql:8
    container_name: hrms_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: hrms_db
    ports:
      - "3307:3306"

  redis:
    image: redis:alpine
    container_name: hrms_redis
    ports:
      - "6379:6379"
```

---

## 📁 Create `Dockerfile`

```Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "run", "dev"]
```

---

## ▶️ Run Project (Docker)

```bash
docker-compose up --build
```

Stop:

```bash
docker-compose down
```

---

# ⚠️ Puppeteer Fix (IMPORTANT)

If using Docker/Linux, install dependencies:

```bash
apt-get update && apt-get install -y \
  libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libxcomposite1 libxdamage1 libxrandr2 \
  libgbm1 libasound2 libpangocairo-1.0-0 \
  libx11-xcb1 libxshmfence1 libglu1-mesa
```

---

# 🔐 Authentication Flow

1. User Login → returns:

   * accessToken
   * refreshToken

2. Frontend stores:

   * accessToken (localStorage)
   * refreshToken (httpOnly cookie or storage)

3. When accessToken expires:

   * Call `/auth/refresh`
   * Get new accessToken

---

# 🧑‍💼 Employee Flow

1. Register User
2. Create Employee (link with user_id)
3. Assign Department
4. Set Salary

---

# 💰 Payroll Flow (IMPORTANT)

### Steps:

1. Ensure employee has salary
2. Generate payroll:

```http
POST /payroll/generate
```

```json
{
  "employeeId": 1,
  "month": 3,
  "year": 2026,
  "tds": 2000
}
```

3. Fetch payroll:

```http
GET /payroll/view
```

4. Download payslip:

```http
GET /payroll/payslip/:id
```

---

# 📅 Attendance Flow

### Employee:

* Check In → `/attendance/checkin`
* Check Out → `/attendance/checkout`

### HR:

* Mark attendance:

```json
{
  "employeeId": 2,
  "status": "present"
}
```

---

# 📋 Task Flow

* HR/Manager → Create Task
* Employee → Drag & update status
* Status:

  * todo
  * in_progress
  * completed

---

# 🔑 RBAC (Role-Based Access)

| Role     | Access                    |
| -------- | ------------------------- |
| Admin    | Full                      |
| HR       | Manage employees, payroll |
| Manager  | Tasks + attendance        |
| Employee | Limited                   |

---

# 📄 API Endpoints (Important)

### Auth

* POST `/auth/login`
* POST `/auth/refresh`

### Employee

* GET `/employees`
* POST `/employees`

### Payroll

* POST `/payroll/generate`
* GET `/payroll/view`
* GET `/payroll/payslip/:id`

### Attendance

* POST `/attendance/checkin`
* PUT `/attendance/checkout`
* GET `/attendance?month=3&year=2026`

### Tasks

* GET `/tasks`
* POST `/tasks`
* PUT `/tasks/:id`

---

# 🧪 Run Tests / Debug

```bash
npm run dev
```

Check logs:

```bash
docker logs hrms_app
```

---

# 🛠️ Common Issues

### ❌ Payroll not showing

✔ Ensure payroll generated
✔ Check employee salary

---

### ❌ Puppeteer error

✔ Install Linux dependencies
✔ Use `--no-sandbox`

---

### ❌ Token expires

✔ Implement refresh token flow

---

# 🚀 Future Improvements

* Queue (BullMQ) for PDF generation
* Redis caching
* Email service
* Notifications
* Dashboard analytics

---

# 👨‍💻 Author

Prince Raj 🚀

---
