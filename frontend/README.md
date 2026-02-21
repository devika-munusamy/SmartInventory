# Smart Inventory Management System - Frontend

Modern React frontend for Smart Inventory Management System built with Vite, Tailwind CSS, and Chart.js.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark mode support
- 📊 Interactive charts and analytics
- 🔐 JWT authentication
- 📱 Fully responsive design
- ✨ Smooth animations and transitions
- 🎯 Role-based access control
- 📦 QR code generation and download
- 🔔 Real-time notifications

## Prerequisites

- Node.js (v16 or higher)
- Backend API running on port 5000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── package.json         # Dependencies
```

## Pages

- **Login/Register** - Authentication pages
- **Dashboard** - Overview with stats and quick actions
- **Equipment** - Equipment management with QR codes
- **Assignments** - Track equipment assignments
- **Maintenance** - Schedule and manage maintenance
- **Analytics** - Charts and insights
- **Notifications** - User notifications
- **Audit Logs** - Activity tracking (Admin only)

## Technologies

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **QRCode** - QR code generation
- **Lucide React** - Icons

## Default Credentials

For testing, you can register a new account or use:
- Email: admin@example.com
- Password: admin123

(Note: You'll need to create this account via the register page first)
