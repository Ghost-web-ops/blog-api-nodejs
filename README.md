# Blog API (Node.js & PostgreSQL)

A robust RESTful API for a modern blog platform, featuring JWT authentication, Google OAuth, and complete CRUD functionality for posts.

[![NodeJS](https://img.shields.io/badge/node.js-18.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)

## ✨ Core Features

- 🔐 **Secure Authentication**: JWT-based security for user registration/login and password protection using `bcryptjs`.
- 🌐 **Google OAuth 2.0**: Effortless one-click sign-in and sign-up using Google accounts.
- ✍️ **Full Post Management**: Complete CRUD operations (`Create`, `Read`, `Update`, `Delete`) for blog posts.
- 🛡️ **Route Protection & Authorization**: Middleware ensures that only authenticated users can create posts and only post authors can modify or delete their own content.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT), bcryptjs, Passport.js (for Google OAuth)
- **Environment Management**: `dotenv`

---

## API Endpoints

A summary of the available API routes. All protected routes require a `Bearer Token` in the `Authorization` header.

| Method   | Endpoint                 | Protection | Description                      |
| :------- | :----------------------- | :--------- | :------------------------------- |
| `POST`   | `/api/register`          | Public     | Creates a new user.              |
| `POST`   | `/api/login`             | Public     | Authenticates a user, returns JWT. |
| `GET`    | `/api/auth/google`       | Public     | Initiates Google OAuth flow.     |
| `GET`    | `/api/posts`             | Public     | Fetches all posts.               |
| `GET`    | `/api/posts/:id`         | Public     | Fetches a single post by ID.     |
| `POST`   | `/api/posts`             | **JWT Auth** | Creates a new post.              |
| `PUT`    | `/api/posts/:id`         | **JWT Auth** | Updates a post (author only).    |
| `DELETE` | `/api/posts/:id`         | **JWT Auth** | Deletes a post (author only).    |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

### Local Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Ghost-web-ops/blog-api-nodejs.git
    cd blog-api-nodejs
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Setup environment variables:**
    - Create a `.env` file in the root directory by copying the example file:

        ```bash
        cp .env.example .env
        ```

    - Fill in the required values in your new `.env` file (`DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, etc.).

4. **Database Setup:**
    - Start your PostgreSQL service.
    - Create a new database with the name you specified in `DB_DATABASE`.
    - Connect to your database and execute the SQL script to create the necessary tables:

        ```sql
        -- Example: psql -U your_user -d your_database -a -f database.sql
        -- The file 'database.sql' should contain CREATE TABLE statements for 'users' and 'posts'.
        ```

5. **Start the development server:**

    ```bash
    npm run dev
    ```

    The API will be running on `http://localhost:4000` (or your specified port).

---

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.
# blog-api-nodejs
