# Setup Instructions - Step by Step

## Prerequisites Check
- [ ] Node.js installed (check with `node --version`)
- [ ] VS Code installed
- [ ] MongoDB installed OR MongoDB Atlas account created

## Step 1: Configure Backend

1. Open VS Code in the project folder:
   ```
   Right-click on SmartInventory folder → "Open with Code"
   ```

2. Edit `backend/.env` file:
   - Replace `your-email@gmail.com` with your Gmail address (2 places)
   - Replace `your-16-char-app-password` with your Gmail App Password
   - If using MongoDB Atlas, uncomment and update the MONGODB_URI line

## Step 2: Install Backend Dependencies

1. Open VS Code Terminal (Ctrl + `)
2. Navigate to backend:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Step 3: Install Frontend Dependencies

1. Open a NEW terminal in VS Code (Click the + icon in terminal)
2. Navigate to frontend:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Step 4: Start the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
You should see: "🚀 Server running on port 5000"

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
You should see: "Local: http://localhost:3000"

## Step 5: Access the Application

1. Open your browser to: `http://localhost:3000`
2. Click "Sign up" to create your first account
3. Choose "Admin" role for full access
4. Login and start using the system!

## Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running (if local)
- Check your MONGODB_URI in .env file
- Try MongoDB Atlas if local doesn't work

### "Email not sending"
- Verify your Gmail App Password is correct
- Make sure 2-Step Verification is enabled on Gmail
- Check EMAIL_USER and EMAIL_PASSWORD in .env

### "Port already in use"
- Close any other applications using port 5000 or 3000
- Or change the PORT in backend/.env

## Quick Test

After setup, test these features:
1. ✅ Register and login
2. ✅ Add a piece of equipment
3. ✅ Download QR code
4. ✅ Create an assignment
5. ✅ View dashboard statistics

## Need Help?

- Check README.md for detailed documentation
- Review QUICKSTART.md for quick reference
- Check walkthrough.md for complete feature list
