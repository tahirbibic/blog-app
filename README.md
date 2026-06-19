# Blog API

A REST API for a blog platform with authentication and authorization. Users can register, log in, and publish posts. Each post belongs to an author; only the author (or an admin) can edit or delete it.

## Tech Stack

- **Next.js** — frontend framework
- **FastAPI** — web framework
- **PostgreSQL** — database
- **SQLAlchemy** — ORM
- **Alembic** — database migrations
- **JWT (python-jose)** — token-based authentication
- **bcrypt** — password hashing

## Features

- User registration and login (JWT)
- Hashed passwords (bcrypt)
- Roles (user / admin)
- Full CRUD for posts
- Ownership-based authorization (only the author can edit their post) and role-based (admin can do anything)
- Automatic request validation (Pydantic)

## Getting Started

1. Clone the repo and enter the folder
2. Create and activate a virtual environment:
python -m venv venv

venv\Scripts\activate
3. Install dependencies:
pip install -r requirements.txt
4. Create a `.env` file with:
SECRET_KEY=your-secret-key

DATABASE_URL=postgresql://postgres:password@localhost:5432/blog
5. Run migrations:
alembic upgrade head
6. Start the server:
uvicorn main:app --reload
7. Open the docs: `http://localhost:8000/docs`

## API Endpoints

### Auth
- `POST /register` — register a new account
- `POST /login` — log in (returns a JWT token)
- `GET /profile` — current logged-in user info

### Posts
- `GET /posts` — list all posts
- `GET /posts/{id}` — get a single post
- `POST /posts` — create a post (requires login)
- `PUT /posts/{id}` — update a post (author or admin)
- `DELETE /posts/{id}` — delete a post (author or admin)

### Users
- `GET /users` — list all accounts
- `GET /users/{id}` — get a single account
- `DELETE /users/{id}` — delete an account (admin only)