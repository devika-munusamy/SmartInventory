# Smart Inventory Management System

A modern, full-stack inventory management system for tracking remote work equipment. Built with the MERN stack (MongoDB, Express, React, Node.js) and designed to be interview-ready with professional features and clean architecture.

## 🌟 Key Features

### Core Functionality
- **Equipment Management** - Track laptops, monitors, peripherals, and other equipment
- **Assignment Workflow** - Assign equipment to employees and track returns
- **QR Code Generation** - Generate and download QR codes for each item
- **Maintenance Scheduling** - Schedule and track equipment maintenance
- **File Attachments** - Upload receipts, manuals, and warranties
- **Role-Based Access** - Admin, HR, and Employee roles with different permissions

### Advanced Features
- **Email Notifications** - Automated emails for assignments, returns, and maintenance
- **Analytics Dashboard** - Charts and insights on equipment utilization and costs
- **Audit Logging** - Comprehensive tracking of all user actions
- **Real-time Notifications** - In-app notification system
- **Search & Filters** - Powerful search and filtering capabilities

### UI/UX
- **Modern Design** - Gradient backgrounds, glassmorphism effects, smooth animations
- **Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Ready** - Built-in dark mode support
- **Professional** - Clean, interview-ready interface

## 🚀 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer (Email)
- Multer (File Uploads)
- QRCode Generation
- bcryptjs (Password Hashing)

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Chart.js
- Lucide React Icons

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-inventory
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Smart Inventory <your-email@gmail.com>
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎯 Usage

### First Time Setup

1. Start MongoDB
2. Start the backend server (`npm run dev` in backend folder)
3. Start the frontend (`npm run dev` in frontend folder)
4. Register a new admin account at `http://localhost:3000/register`
5. Start adding equipment and managing assignments!

### Email Configuration

To enable email notifications:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `.env` as `EMAIL_PASSWORD`

## 📁 Project Structure

```
SmartInventory/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth, upload, audit middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Email service
│   ├── uploads/         # File uploads directory
│   ├── server.js        # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation (client & server)
- File upload restrictions
- Comprehensive audit logging

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/:id/return` - Return equipment

### Maintenance
- `GET /api/maintenance` - Get maintenance tasks
- `POST /api/maintenance` - Schedule maintenance
- `PUT /api/maintenance/:id` - Update maintenance

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/equipment-utilization` - Utilization data
- `GET /api/analytics/assignment-trends` - Assignment trends
- `GET /api/analytics/maintenance-costs` - Cost breakdown

## 🎨 Design Philosophy

This project prioritizes:
- **Stability** - No experimental features, only proven technologies
- **Professional UI** - Modern, clean design suitable for interviews
- **Best Practices** - Clean code, proper error handling, validation
- **Free Tools** - 100% open-source, no paid services required

## 💡 Interview Talking Points

- **Full-Stack Development** - Complete MERN stack implementation
- **Authentication & Authorization** - JWT with role-based access
- **RESTful API Design** - Clean, well-structured endpoints
- **Database Design** - Normalized schema with proper relationships
- **Email Integration** - Automated notifications with Nodemailer
- **File Handling** - Secure file uploads with Multer
- **Modern Frontend** - React hooks, context API, responsive design
- **Data Visualization** - Chart.js integration for analytics
- **Security** - Password hashing, input validation, audit logs

## 📝 License

MIT

## 👤 Author

Built as a portfolio project to demonstrate full-stack development skills.
