require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const passport = require("./config/passport");
const app = express();
const port = process.env.PORT || 3000;
const contactsRoutes = require("./routes/contacts");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");
const { connectToDb } = require("./db/connect");

app.use(
  cors({
    origin: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, 
    optionsSuccessStatus: 200
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecs);
});

const swaggerOptions = {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Contacts API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    url: "/api-docs.json",
  },
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, swaggerOptions)
);

app.use("/contacts", contactsRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/", indexRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } else {
    console.error("Failed to connect to database", err);
  }
});
