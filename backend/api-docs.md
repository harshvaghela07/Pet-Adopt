# Pet Adoption API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Include JWT in header for protected routes:
```
Authorization: Bearer <token>
```

---

## Auth

### Register
```
POST /auth/register
Body: { "name": "string", "email": "string", "password": "string" }
```

### Login
```
POST /auth/login
Body: { "email": "string", "password": "string" }
Returns: { data: user, token }
```

### Get Me
```
GET /auth/me
Auth: Required
```

---

## Pets

### List Pets
```
GET /pets?page=1&limit=12&search=&species=&breed=&ageMin=&ageMax=&status=
Query: page, limit, search, species, breed, ageMin, ageMax, status (admin only)
```

### Get Filters
```
GET /pets/filters
Returns: { species: [], breeds: [] }
```

### Get Pet
```
GET /pets/:id
```

### Create Pet (Admin)
```
POST /pets
Auth: Admin
Body: { name, species, breed, age, description?, imageUrl?, status? }
```

### Update Pet (Admin)
```
PUT /pets/:id
Auth: Admin
Body: { name?, species?, breed?, age?, description?, imageUrl?, status? }
```

### Delete Pet (Admin)
```
DELETE /pets/:id
Auth: Admin
```

---

## Adoptions

### Apply to Adopt
```
POST /adoptions/apply
Auth: User
Body: { "petId": "mongoId", "message": "optional string" }
```

### My Applications
```
GET /adoptions/my
Auth: User
```

### All Applications (Admin)
```
GET /adoptions?status=pending
Auth: Admin
Query: status (optional)
```

### Update Application Status (Admin)
```
PUT /adoptions/:id/status
Auth: Admin
Body: { "status": "approved" | "rejected", "adminNotes": "optional" }
```

---

## Users (Admin)

### List Users
```
GET /users?search=
Auth: Admin
Query: search (optional, by name or email)
```

### Delete User
```
DELETE /users/:id
Auth: Admin
(Cannot delete own account)
```
