require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const app = express();
const port = process.env.PORT || 3000;
const contactsRoutes = require("./routes/contacts");
const indexRoutes = require("./routes/index");
const { connectToDb } = require("./db/connect");

app.use(express.json());

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/contacts", contactsRoutes);
// app.use('/', indexRoutes);

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
