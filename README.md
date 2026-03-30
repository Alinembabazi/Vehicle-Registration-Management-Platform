# Vehicle Management System

## Project Overview

Vehicle Management System is a React-based frontend application for managing vehicle records. It provides a simple interface for users to register vehicles, view all registered vehicles, inspect vehicle details, and update existing records through a protected dashboard.

The project is built with Vite for fast development, React Router for navigation, React Query for server-state handling, and a custom authentication context for lightweight login state management.

## Features

- Secure route protection using a custom authentication context
- Demo login flow for accessing the dashboard
- Vehicle registration form
- Dashboard for listing and managing vehicles
- Vehicle detail view with grouped sections for information, owner, registration, and insurance
- Vehicle editing flow with prefilled form values
- Vehicle deletion support
- API integration with the Railway backend service
- Toast notifications for user feedback

## Tech Stack

- React
- Vite
- React Router
- TanStack React Query
- Axios
- Tailwind CSS
- React Hot Toast

## Running Locally

### Prerequisites

- Node.js 18 or later
- npm

### Installation

1. Open a terminal in the project folder:

```bash
cd vehicle-management
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Other Useful Commands

Run lint checks:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/     Reusable UI and route-protection components
  context/        Authentication provider and context setup
  hooks/          Custom hooks such as useAuth
  pages/          Main application screens
  services/       API request logic and payload formatting
```

## State Management Approach

This project uses a layered state management approach so that each kind of state is handled in the simplest place possible.

### 1. Authentication State

Authentication is managed with React Context in [`src/context/AuthContext.jsx`](./src/context/AuthContext.jsx). The `AuthProvider` stores whether the user is logged in and exposes `login` and `logout` functions to the rest of the app.

This is a good fit because authentication status is shared across multiple pages and components, such as:

- protected routes
- the navigation bar
- the login page

The login flag is also persisted in `localStorage` so the user session can survive a page refresh.

### 2. Server State

Data that comes from the backend API, such as vehicle lists and vehicle details, is managed with TanStack React Query.

React Query is used for:

- fetching vehicles
- fetching a single vehicle
- creating vehicles
- updating vehicles
- deleting vehicles
- cache invalidation after mutations

This keeps API state separate from UI state and reduces manual loading/error/data management.

### 3. Local UI State

Component-level state such as form fields, active tabs, modals, and step navigation is managed with React `useState`.

Examples include:

- the multi-step vehicle registration form
- the currently selected tab on the vehicle detail page
- the local draft state in the edit form
- delete confirmation modal visibility

This approach keeps the architecture clean:

- Context for shared app-wide state
- React Query for backend data
- `useState` for local UI interactions

## Authentication Notes

The current project uses demo credentials defined in the frontend authentication context for local access to protected pages.

Default demo credentials:

- Email: `test@gmail.com`
- Password: `Password!234`

## API Integration

The frontend communicates with the backend through [`src/services/api.js`](./src/services/api.js), which centralizes:

- API requests
- error handling
- vehicle payload formatting for create and update operations
- response normalization for frontend consumption

## Summary

This project is structured to stay simple, maintainable, and practical for a CRUD-style frontend application. It separates shared auth state, backend state, and local UI state clearly, which makes the codebase easier to extend and debug.
