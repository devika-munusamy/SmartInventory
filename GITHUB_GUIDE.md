# How to Share your Project on GitHub

Follow these steps to upload your **Smart Inventory** project to GitHub so you can share it with your friend.

## 1. Create a Repository on GitHub
1.  Log in to [GitHub](https://github.com).
2.  Click the **+** (plus) icon in the top-right corner and select **New repository**.
3.  Name it (e.g., `smart-inventory-system`).
4.  Keep it **Public** (or Private if you prefer).
5.  **Do NOT** initialize with a README, .gitignore, or license (we already have these).
6.  Click **Create repository**.

## 2. Initialize and Push your Code
Open your terminal in the root directory (`SmartInventory`) and run:

```bash
# Initialize git
git init

# Add all files (will follow the .gitignore I created)
git add .

# Commit your changes
git commit -m "Initial commit: Smart Inventory Management System"

# Link to your GitHub repo (Replace YOUR_URL with the link from GitHub)
git remote add origin https://github.com/YOUR_USERNAME/smart-inventory-system.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 3. How your friend should run it
When your friend gets the code, they will need to:
1.  **Clone the repo:** `git clone <your-repo-url>`
2.  **Install dependencies:** Run `npm install` in both `backend` and `frontend` folders.
3.  **Setup Environment:** Copy `.env.example` (or create a new `.env`) in the `backend` folder with their own MongoDB URI and secret.
4.  **Run:** Use `npm run dev` in both folders.

> [!IMPORTANT]
> Never share your `.env` file publicly as it contains your database credentials and secret keys!
