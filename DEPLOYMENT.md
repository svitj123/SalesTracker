# Deployment Guide

Since you have downloaded the code, you can deploy this application to any cloud provider that supports Node.js.

The most cost-effective way to run this 24/7 with a database is using **Render** (for hosting) and **Neon** (for the database). Both offer generous free tiers.

## Prerequisites

1.  **GitHub Account**: You'll need to push this code to a GitHub repository.
2.  **Neon Account**: For the PostgreSQL database (https://neon.tech).
3.  **Render Account**: For hosting the application (https://render.com).

---

## Step 1: Set up the Database (Neon)

1.  Log in to [Neon Console](https://console.neon.tech).
2.  Create a new project (e.g., "sales-tracker").
3.  Once created, copy the **Connection String** (it looks like `postgres://user:pass@...`).
    *   *Note: Make sure to select the "Pooled" connection string if available, but direct works too.*

## Step 2: Prepare the Code

1.  Unzip the project on your computer.
2.  Initialize a Git repository and push to GitHub:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    # Create a new repository on GitHub, then:
    git remote add origin <your-github-repo-url>
    git branch -M main
    git push -u origin main
    ```

## Step 3: Deploy to Render

1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub account and select the repository you just pushed.
4.  Configure the service:
    *   **Name**: `sales-tracker` (or whatever you like)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm run start`
    *   **Instance Type**: `Free`
5.  **Environment Variables** (Scroll down to "Advanced" or "Environment"):
    *   Add `DATABASE_URL`: Paste the connection string from Step 1.
    *   Add `SESSION_SECRET`: Type a random long string (e.g., `my-super-secret-key-123`).
    *   Add `NODE_ENV`: `production`
6.  Click **Create Web Service**.

## Step 4: Initialize the Database

Once the deployment starts, the app needs to create the tables in your new database.

**Option A: Run locally (easiest)**
If you have Node.js installed on your computer:
1.  Create a `.env` file in your project folder.
2.  Add `DATABASE_URL=your_neon_connection_string`.
3.  Run:
    ```bash
    npm install
    npm run db:push
    ```

**Option B: Run via Render Shell**
1.  Wait for the deploy to finish (it might fail initially because tables are missing).
2.  Go to the **Shell** tab in your Render service dashboard.
3.  Run: `npm run db:push`

## Troubleshooting

**"tsx: not found" error on Render**
If you see this error, it means the build dependencies weren't installed in production mode.
Fix it by running this command locally before pushing to GitHub:
```bash
npm install tsx esbuild typescript --save
```
Then commit and push the changes.

---

## Alternative: Docker

I have included a `Dockerfile` if you prefer to deploy using Docker containers (e.g., on DigitalOcean App Platform, Fly.io, or Railway).

1.  **Build**: `docker build -t sales-tracker .`
2.  **Run**: `docker run -p 5000:5000 -e DATABASE_URL=... -e SESSION_SECRET=... sales-tracker`
