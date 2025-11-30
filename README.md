# SalesTracker - Agent Report System

This is a production-ready React application for managing weekly agent sales reports. It allows for parsing of specific report formats, data visualization, and historical tracking.

## Features

- **Smart Parsing**: Automatically extracts location, sales figures (Fix/Mob), hours, and agent names from raw text reports.
- **Dashboard**: Visual analytics including sales trends, location performance, and conversion rates.
- **Local Persistence**: Data is stored locally in the browser, so it persists across refreshes (simulating a database).
- **Responsive Design**: Fully responsive UI that works on desktop and mobile.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: Zustand (with persistence)
- **Charts**: Recharts
- **Routing**: Wouter

## How to Use

1. Go to the **New Report** page.
2. Paste a report in the text area (see `example_reports.txt` for samples).
3. Click **Check Format** to preview the parsed data.
4. Click **Add Report** to save it to the system.
5. View the **Dashboard** for analytics or **All Reports** for the history.

## Deployment

### Deploying the Frontend (Vercel/Netlify/Replit)

This project is a standard Vite React application.

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Serve the `dist` folder**.

### Environment Variables

Create a `.env` file based on `.env.example` if you integrate a real backend later.

## Project Structure

```
client/
  src/
    components/   # UI Components
    lib/
      parser.ts   # Report parsing logic
      store.ts    # State management (Mock DB)
    pages/        # Application views
    App.tsx       # Routing
```

## Note on Architecture

This version acts as a "Frontend Prototype" where the backend logic (parsing and storage) is simulated in the browser for immediate feedback and testing. In a full full-stack implementation, `parser.ts` logic would move to a Python/Node backend, and `store.ts` would be replaced by API calls to a database.
