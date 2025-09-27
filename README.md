# CSE 341 Week 4 Project - Authentication API

This project implements a complete authentication system with OAuth for the CSE 341 course requirements.

## Features

### ✅ API Endpoints and Documentation (30 points)

- Complete Swagger.json present and testable
- GET/POST/PUT/DELETE for Contacts and Users collections
- Shows database updates
- Returns proper HTTP status codes (200, 201, 400, 404, 500)

### ✅ Data Validation (10 points)

- Both POST and PUT routes for both collections contain data validation
- Returns 400/500 errors when requirements aren't met
- Email format validation
- Date format validation (YYYY-MM-DD)
- Password length validation (minimum 6 characters)
- Required field validation

### ✅ Error Handling (10 points)

- Each route uses try/catch error handling
- Returns 400/500 status codes when errors are thrown
- Proper error messages for different scenarios

### ✅ Deployment (10 points)

- Application works at published link (not localhost)
- Sensitive information not present in GitHub
- Environment variables properly configured

### ✅ OAuth (30 points)

- Google OAuth authentication implemented
- Each protected route requires authentication
- At least two protected routes exist (all Users routes)
- Session-based authentication with Passport.js

### ✅ Database (10 points)

- Database has two collections: Contacts and Users
- Users collection has 11 fields (exceeds 7 field requirement):
  - firstName, lastName, email, password, phoneNumber, address, dateOfBirth
  - googleId, isActive, createdAt, updatedAt

## Collections

### Contacts Collection

- firstName (String, required)
- lastName (String, required)
- email (String, required, email format)
- favoriteColor (String, required)
- birthday (Date, required)

### Users Collection

- firstName (String, required)
- lastName (String, required)
- email (String, required, unique, email format)
- password (String, required, hashed with bcrypt)
- phoneNumber (String, required)
- address (String, required)
- dateOfBirth (Date, required)
- googleId (String, unique, sparse)
- isActive (Boolean, default: true)
- createdAt (Date, default: Date.now)
- updatedAt (Date, default: Date.now)

## API Endpoints

### Authentication Routes

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user (protected)
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### Contacts Routes

- `GET /contacts` - Get all contacts
- `GET /contacts/:id` - Get contact by ID
- `POST /contacts` - Create new contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

### Users Routes (All Protected)

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file with the following variables:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
   SESSION_SECRET=your-super-secret-session-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   PORT=3000
   NODE_ENV=development
   RENDER_URL=https://your-app-name.onrender.com
   ```

3. **Google OAuth Setup:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (development)
     - `https://your-app-name.onrender.com/auth/google/callback` (production)

4. **Run the application:**

   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Access Swagger Documentation:**
   - Development: `http://localhost:3000/api-docs`
   - Production: `https://your-app-name.onrender.com/api-docs`

## Testing the API

### 1. Register a new user:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phoneNumber": "123-456-7890",
    "address": "123 Main St",
    "dateOfBirth": "1990-01-01"
  }'
```

### 2. Login:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Test protected route (requires authentication):

```bash
curl -X GET http://localhost:3000/users \
  -H "Cookie: connect.sid=your-session-cookie"
```

### 4. Test Google OAuth:

Visit: `http://localhost:3000/auth/google`

## Validation Examples

### Invalid email format:

```bash
curl -X POST http://localhost:3000/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "invalid-email",
    "favoriteColor": "blue",
    "birthday": "1990-01-01"
  }'
```

Returns: 400 Bad Request with "Invalid email format"

### Missing required fields:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "email": "john@example.com"
  }'
```

Returns: 400 Bad Request with "Missing required fields"

## Security Features

- Passwords are hashed using bcrypt
- Session-based authentication
- Google OAuth integration
- Protected routes require authentication
- Input validation and sanitization
- Proper error handling without exposing sensitive information

## Deployment

The application is configured for deployment on Render.com with:

- Environment variables for production
- Secure session cookies
- Proper CORS configuration
- Database connection handling
