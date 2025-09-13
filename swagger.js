const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contacts API",
      version: "1.0.0",
      description: "A simple Contacts API for managing contact information",
    },
    servers: [
      {
        url: process.env.RENDER_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
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
