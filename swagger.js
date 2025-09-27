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
    },
    servers: [
      {
        url: getBaseUrl(),
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid",
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
            },
            firstName: {
              type: "string",
            },
            lastName: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
            favoriteColor: {
              type: "string",
            },
            birthday: {
              type: "string",
              format: "date",
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
            },
            firstName: {
              type: "string",
            },
            lastName: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
            },
            phoneNumber: {
              type: "string",
            },
            address: {
              type: "string",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
            },
            googleId: {
              type: "string",
            },
            isActive: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
            error: {
              type: "string",
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
