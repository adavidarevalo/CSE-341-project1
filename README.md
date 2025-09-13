# Contacts API

A RESTful API for managing contact information built with Node.js, Express, and MongoDB.

## Features

- **GET** `/contacts` - Retrieve all contacts
- **GET** `/contacts/:id` - Retrieve a specific contact by ID
- **POST** `/contacts` - Create a new contact
- **PUT** `/contacts/:id` - Update an existing contact
- **DELETE** `/contacts/:id` - Delete a contact

## Contact Schema

Each contact must include the following required fields:

- `firstName` (string) - The contact's first name
- `lastName` (string) - The contact's last name
- `email` (string) - The contact's email address
- `favoriteColor` (string) - The contact's favorite color
- `birthday` (date) - The contact's birthday in YYYY-MM-DD format

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

## Testing

Use the provided `test-api.rest` file with REST Client extensions in VS Code or similar tools to test the API endpoints.

## Environment Variables

Create a `.env` file with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
RENDER_URL=your_render_deployment_url (optional)
```

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Or start the production server:
   ```bash
   npm start
   ```

The server will start on port 3000 by default (or the port specified in your environment variables).

## Example Usage

### Create a Contact

```bash
curl -X POST http://localhost:3000/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "favoriteColor": "blue",
    "birthday": "1990-05-15"
  }'
```

### Get All Contacts

```bash
curl http://localhost:3000/contacts
```

### Update a Contact

```bash
curl -X PUT http://localhost:3000/contacts/CONTACT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe.updated@example.com",
    "favoriteColor": "red",
    "birthday": "1990-05-15"
  }'
```

### Delete a Contact

```bash
curl -X DELETE http://localhost:3000/contacts/CONTACT_ID
```
