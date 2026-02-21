# Quick Start Guide - Smart Inventory Management System

## Prerequisites
- Node.js v16+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Gmail account for email notifications

## Step 1: Clone and Setup

```bash
cd SmartInventory
```

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-inventory
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d

# Gmail SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Smart Inventory <your-email@gmail.com>

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Getting Gmail App Password:
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Use that password in EMAIL_PASSWORD

```bash
# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

## Step 3: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 4: First Time Use

1. Open browser to `http://localhost:3000`
2. Click "Sign up" to create an account
3. Fill in your details and select role (Admin recommended for first user)
4. Login with your credentials
5. Start adding equipment!

## Testing the Application

### Create Equipment
1. Go to Equipment page
2. Click "Add Equipment"
3. Fill in details (Name, Serial Number are required)
4. Submit - QR code will be auto-generated

### Assign Equipment
1. Go to Assignments page
2. Click "New Assignment"
3. Select equipment and user
4. Submit - Email notification will be sent

### Schedule Maintenance
1. Go to Maintenance page (Admin/HR only)
2. Click "Schedule Maintenance"
3. Select equipment and date
4. Submit

### View Analytics
1. Go to Analytics page (Admin/HR only)
2. View charts for equipment utilization, assignment trends, and costs

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas and update MONGODB_URI

### Email Not Sending
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Make sure 2-Step Verification is enabled

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.js

## Default Test Data

You can create test users with different roles:
- Admin: Full access to all features
- HR: Can manage equipment and assignments
- Employee: Can view their own assignments

## Production Deployment

### Backend (Heroku example)
```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your-atlas-uri
heroku config:set JWT_SECRET=your-secret
# ... set other env vars
git push heroku main
```

### Frontend (Vercel example)
```bash
cd frontend
npm run build
vercel --prod
```

Update frontend API URL in `vite.config.js` to point to your deployed backend.

## Features to Demo

1. **Authentication** - Login/Register with role selection
2. **Equipment Management** - CRUD operations with QR codes
3. **Assignments** - Assign equipment with email notifications
4. **Maintenance** - Schedule and track maintenance tasks
5. **Analytics** - Interactive charts and statistics
6. **Audit Logs** - Complete activity tracking
7. **Responsive Design** - Works on all devices

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review walkthrough.md for complete feature list
- Check implementation_plan.md for technical details

Enjoy using Smart Inventory Management System! 🚀
