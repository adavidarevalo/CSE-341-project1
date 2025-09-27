const swaggerJsdoc = require("swagger-jsdoc");
const getBaseUrl = () => {
  if (process.env.RENDER_URL) {
    return process.env.RENDER_URL;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://cse-341-project1-jpua.onrender.com"; // Replace with your actual Render URL
  }
  return "http://localhost:3000";
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contacts API",
      version: "1.0.0",
      description: `
A simple Contacts API for managing contact information.

## Authentication

This API uses session-based authentication via GitHub OAuth.

### How to authenticate:

1. **Login via GitHub OAuth**: Visit \`/login\` to authenticate with GitHub
2. **Access Protected Routes**: Once authenticated, you can access all protected endpoints
3. **Session Management**: Your session will persist across requests via cookies

### Authentication Flow:

1. Navigate to \`/login\` (redirects to GitHub OAuth)
2. Authorize the application on GitHub
3. You'll be redirected back to the API documentation
4. All protected routes are now accessible

### Protected Routes:

- All \`/contacts\` endpoints require authentication
- All \`/users\` endpoints require authentication
- Authentication endpoints (\`/auth/*\`) are public

**Note**: To test protected endpoints in Swagger UI, first authenticate by visiting \`/login\` in the same browser session.
      `,
    },
    servers: [
      {
        url: getBaseUrl(),
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
          description: "Session-based authentication via GitHub OAuth. Visit /login to authenticate.",
        },
      },
      schemas: {
        Contact: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "favoriteColor",
            "birthday",
          ],
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier of the contact",
            },
            firstName: {
              type: "string",
              description: "The first name of the contact",
            },
            lastName: {
              type: "string",
              description: "The last name of the contact",
            },
            email: {
              type: "string",
              format: "email",
              description: "The email address of the contact",
            },
            favoriteColor: {
              type: "string",
              description: "The favorite color of the contact",
            },
            birthday: {
              type: "string",
              format: "date",
              description: "The birthday of the contact",
            },
          },
        },
        User: {
          type: "object",
          required: [
            "firstName",
            "lastName",
            "email",
            "password",
            "phoneNumber",
            "address",
            "dateOfBirth",
          ],
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier of the user",
            },
            firstName: {
              type: "string",
              description: "The first name of the user",
            },
            lastName: {
              type: "string",
              description: "The last name of the user",
            },
            email: {
              type: "string",
              format: "email",
              description: "The email address of the user",
            },
            password: {
              type: "string",
              description: "The password of the user (hashed)",
            },
            phoneNumber: {
              type: "string",
              description: "The phone number of the user",
            },
            address: {
              type: "string",
              description: "The address of the user",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "The date of birth of the user",
            },
            googleId: {
              type: "string",
              description: "Google OAuth ID",
            },
            isActive: {
              type: "boolean",
              description: "Whether the user is active",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "When the user was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "When the user was last updated",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            error: {
              type: "string",
              description: "Detailed error information",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = specs;
