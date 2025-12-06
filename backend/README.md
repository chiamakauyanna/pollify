# Pollify Backend

A **Django REST Framework** backend for a secure poll and voting system.
Admins can create polls, add choices, and generate **magic vote links** for voters. Voters can submit votes via unique links without needing accounts.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Configuration](#configuration)
* [Database & Migrations](#database--migrations)
* [Admin Setup](#admin-setup)
* [API Endpoints](#api-endpoints)
* [Authentication](#authentication)
* [Voting Flow](#voting-flow)
* [License](#license)

---

## Features

* Admin-only poll creation and management.
* Add multiple choices per poll.
* Generate magic vote links for voters (no accounts required).
* Voters can submit votes using unique tokens.
* View poll results **after poll ends**.
* JWT-based authentication for admins.

---

## Tech Stack

* Python 3.13
* Django 4.x
* Django REST Framework
* Simple JWT (`djangorestframework-simplejwt`)
* SQLite (default, can switch to Postgres/MySQL)

---

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/Scripts/activate  # Windows
# OR
source venv/bin/activate      # macOS/Linux
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser (admin):

```bash
python manage.py createsuperuser
```

6. Run the development server:

```bash
python manage.py runserver
```

---

## Configuration

* **Environment Variables:** You can configure a `.env` file for secrets such as `SECRET_KEY`, database credentials, or JWT settings.
* **Default DB:** SQLite (`db.sqlite3`) is used by default.
* **Switching DB:** Update `DATABASES` in `settings.py` for PostgreSQL, MySQL, etc.

---

## Database & Migrations

Models:

* **User**: Custom user model (admins only)
* **Poll**: Poll object with title, description, start/end time
* **Choice**: Options for a poll
* **VoteLink**: Magic link for one-time voting
* **Vote**: Stores individual votes

Run migrations:

```bash
python manage.py makemigrations core
python manage.py migrate
```

---

## Admin Setup

Admins are created via Django admin or `createsuperuser`. Only `is_staff=True` users can:

* Create polls
* Add choices
* Generate vote links

Voters do **not** require accounts.

---

## API Endpoints

### **Authentication (Admin Only)**

| Endpoint          | Method | Description                                |
| ----------------- | ------ | ------------------------------------------ |
| `/token/`         | POST   | Get JWT token (requires username/password) |
| `/token/refresh/` | POST   | Refresh JWT access token                   |

**Example Request:**

```json
POST /token/
{
  "username": "Alex",
  "password": "Alex1234!"
}
```

**Response:**

```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

---

### **Poll Management (Admin Only)**

| Endpoint                          | Method    | Description                |
| --------------------------------- | --------- | -------------------------- |
| `/polls/`                         | GET       | List all polls             |
| `/polls/`                         | POST      | Create a new poll          |
| `/polls/{id}/`                    | GET       | Get a poll                 |
| `/polls/{id}/`                    | PUT/PATCH | Update a poll              |
| `/polls/{id}/`                    | DELETE    | Delete a poll              |
| `/polls/{id}/generate_vote_link/` | POST      | Generate a magic vote link |

**Sample Poll POST Request:**

```json
{
  "title": "Favorite Language",
  "description": "Pick one",
  "choices": [
    {"text": "Python"},
    {"text": "JavaScript"}
  ],
  "vote_links": [
    {"invitee_email": "test@example.com", "invitee_name": "Test User"}
  ]
}
```

---

### **Public Voting**

| Endpoint         | Method | Description                                    |
| ---------------- | ------ | ---------------------------------------------- |
| `/public-polls/` | GET    | List active polls available for voting         |
| `/vote/`         | POST   | Submit a vote using a token                    |
| `/poll-results/` | GET    | View poll results (after poll ends, via token) |

**Sample Vote Request:**

```json
POST /vote/
{
  "token": "dbd22f4f-ea1f-4cc2-b60a-1c6cd9d5ee3a",
  "choice_id": "b2a7fa8c-8b6f-4ef1-b7b2-8c18ef98f372"
}
```

**Sample Poll Results Request:**

```http
GET /poll-results/?token=dbd22f4f-ea1f-4cc2-b60a-1c6cd9d5ee3a
```

---

## Authentication Flow (Frontend)

* Admin logs in using `/token/` endpoint.
* Backend returns JWT token.
* Store token on frontend (React state, context, or secure storage).
* Include token in `Authorization` header for protected endpoints.

**Header Example:**

```http
Authorization: Bearer <access_token>
```

Voters use **vote links**, no login required.

---

## Voting Flow

1. Admin generates vote links for a poll.
2. Voter receives a link/token.
3. Voter submits choice with the token via `/vote/`.
4. Backend validates token, records vote, marks link as used.
5. Poll results are visible after poll ends.

---

## License

MIT License © 2025 Chiamaka
