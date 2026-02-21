# Smart Inventory Management System - Backend

Backend API for Smart Inventory Management System built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication with role-based access control
- 📦 Equipment management with QR code generation
- 👥 User management (Admin, HR, Employee roles)
- 📋 Assignment tracking and workflow
- 🔧 Maintenance scheduling
- 📧 Email notifications (Nodemailer + Gmail)
- 📎 File attachments (receipts, manuals, warranties)
- 📊 Analytics and reporting
- 📝 Comprehensive audit logging

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-inventory
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create equipment (Admin/HR)
- `GET /api/equipment/:id` - Get equipment by ID
- `PUT /api/equipment/:id` - Update equipment (Admin/HR)
- `DELETE /api/equipment/:id` - Delete equipment (Admin)

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (Admin/HR)
- `PUT /api/assignments/:id/return` - Return equipment (Admin/HR)

### Maintenance
- `GET /api/maintenance` - Get maintenance tasks
- `POST /api/maintenance` - Schedule maintenance (Admin/HR)
- `PUT /api/maintenance/:id` - Update maintenance (Admin/HR)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/equipment-utilization` - Equipment utilization
- `GET /api/analytics/assignment-trends` - Assignment trends
- `GET /api/analytics/maintenance-costs` - Maintenance costs

### Audit Logs
- `GET /api/audit` - Get audit logs (Admin only)

## Email Configuration

To enable email notifications:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `.env` as `EMAIL_PASSWORD`

## Project Structure

```
backend/
├── config/          # Configuration files
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic services
├── uploads/         # File uploads directory
├── .env.example     # Environment variables template
├── server.js        # Main server file
└── package.json     # Dependencies
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation
- File upload restrictions
- Audit logging

## Technologies

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Multer** - File uploads
- **QRCode** - QR code generation
