# Pet Adoption System

Full stack MERN app - users can browse pets, apply for adoption, admins handle everything from the dashboard.

## What's in it

- **Visitors** - See pets, search/filter, pagination
- **Users** - Sign up, login, apply to adopt, track applications
- **Admin** - Add/edit/delete pets, approve or reject applications, manage users (add user, change role)

Tech: Node + Express + MongoDB on backend, React + Vite + Tailwind on frontend. JWT for auth, role-based access.

## Run it

Need Node 18+ and MongoDB running (local or Atlas).

```bash
# install
cd backend && npm install
cd ../frontend && npm install

# backend env - copy .env.example to .env, set MONGODB_URI and JWT_SECRET
cp backend/.env.example backend/.env

# start backend
cd backend && npm run dev

# start frontend (separate terminal)
cd frontend && npm run dev
```

Backend: localhost:5000 | Frontend: localhost:3000

## First user

Register via the signup form. To make yourself admin, update the role in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

Or have an existing admin add you via Admin → Users → Add User (with role admin).

## API overview

| Method | Route | Auth |
|--------|-------|------|
| POST | /api/auth/register | - |
| POST | /api/auth/login | - |
| GET | /api/auth/me | User |
| GET | /api/pets | - (optional auth for admin filters) |
| GET | /api/pets/:id | - |
| POST | /api/pets | Admin |
| PUT | /api/pets/:id | Admin |
| DELETE | /api/pets/:id | Admin |
| POST | /api/adoptions/apply | User |
| GET | /api/adoptions/my | User |
| GET | /api/adoptions | Admin |
| PUT | /api/adoptions/:id/status | Admin |
| GET | /api/users | Admin |
| POST | /api/users | Admin |
| PUT | /api/users/:id/role | Admin |
| DELETE | /api/users/:id | Admin |

## Project layout

```
backend/
  src/
    config/     - db connection
    controllers/
    middleware/ - auth, optionalAuth, error handler
    models/     - User, Pet, Adoption
    routes/
    validators/

frontend/
  src/
    components/
    context/    - AuthContext
    pages/
    services/   - axios api
```
