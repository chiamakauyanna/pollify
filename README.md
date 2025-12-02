# Pollify

## Overview

**Pollify** is a full-featured polling platform that allows administrators to create polls, manage choices, generate unique vote links, and view analytics. This frontend is built using **Next.js**, **TypeScript**, and **Redux Toolkit**, providing a responsive and modern admin interface.

Admins can:

* Create, update, and delete polls
* Manage poll choices
* Generate unique vote links for invitees
* View poll statistics and analytics
* Track total and daily votes
* Logout securely via JWT authentication

---

## Table of Contents

* [Demo](#demo)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Features](#features)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running the Project](#running-the-project)
* [Redux State Management](#redux-state-management)
* [Components](#components)
* [Folder Structure](#folder-structure)
* [Future Improvements](#future-improvements)

---

## Demo

### Admin Dashboard Screenshot

![Pollify Admin Dashboard](./screenshots/pollify-poll.png)

---

## Tech Stack

* **Framework:** Next.js (v13+)
* **Language:** TypeScript
* **State Management:** Redux Toolkit
* **Styling:** Tailwind CSS
* **Icons:** react-icons
* **Authentication:** JWT (via `authSlice`)
* **Routing:** Next.js dynamic routing

---

## Project Structure

Key directories and files:

```
/components      # Reusable UI components (Button, Loader, Toast, Layouts, Forms)
/pages           # Next.js pages
/pages/dashboard # Admin dashboard pages (polls, analytics, votes)
/redux           # Redux slices and store
/services        # API services (optional)
/styles          # Global Tailwind CSS styles
```

---

## Features

### Poll Management

* View all polls (active, closed, votable)
* Create new polls with multiple choices
* Update or delete polls
* Inline poll editing via `UpdatePollForm`
* Status indicators: **Active/Inactive** and **Votable/Not Votable**

### Vote Management

* Generate unique vote links per invitee
* View poll results after poll ends
* Prevent double voting via token system

### Analytics

* Total polls created
* Active polls count
* Total votes
* Votes today
* Closed polls count

### Sidebar & Layout

* Toggleable sidebar for navigation
* Responsive header
* Admin info with dynamic logout button

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/chiamakauyanna/pollify.git
cd frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Pollify
```

* `NEXT_PUBLIC_API_BASE_URL` — Backend API endpoint
* Add other keys if necessary for analytics or external services

---

## Running the Project

**Development server**:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build**:

```bash
npm run build
npm start
```

---

## Redux State Management

The frontend uses **Redux Toolkit** for state management with slices for:

* **authSlice**: JWT authentication, login, logout
* **pollSlice**: Poll fetching, creation, deletion, and vote stats
* **sidebarSlice**: Toggle sidebar state

Selectors are defined for accessing slices easily:

```ts
const polls = useSelector(selectPolls);
const loading = useSelector(selectPollLoading);
const error = useSelector(selectPollError);
```

---

## Components

### Layout Components

* `AppLayout` – Wraps dashboard pages
* `AdminHeader` – Header with sidebar toggle and logout
* `Sidebar` – Admin sidebar navigation

### UI Components

* `Loader` – Loading spinner
* `Toast` – Notifications
* `Button` – Reusable buttons

### Poll Components

* `AdminPollManagement` – Poll cards with update/delete actions
* `UpdatePollForm` – Inline poll update form

---

## Folder Structure

```
/components
  /common       # Loader, Toast, Buttons
  /layouts      # AppLayout, AdminHeader, Sidebar
  /polls
    AdminPollManagement.tsx
/pages
  /auth
    components.tsx    # UpdatePollForm.tsx, PollForm
    login
  /dashboard
    index.tsx       # Admin dashboard overview
    create.tsx
    polls/[id].tsx  # Single poll detail
  /voter/[token].tsx
/redux
  store.ts
  slices
    authSlice.ts
    pollSlice.ts
    sidebarSlice.ts
/selectors
  pollSelectors.ts
  authSelectors.ts
/styles
  globals.css
```

---

## Future Improvements

* Integrate charting library (Recharts / Chart.js) for poll analytics
* Add user management for admins
* Add email notifications when vote links are generated
* Implement dark mode toggle
* Add pagination and search/filter for polls


