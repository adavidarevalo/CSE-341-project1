const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Validate required fields
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.password ||
      !userData.phoneNumber ||
      !userData.address ||
      !userData.dateOfBirth
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: firstName, lastName, email, password, phoneNumber, address, dateOfBirth",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(userData.dateOfBirth)) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    // Validate password length
    if (userData.password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const result = await User.create(userData);
    res.status(201).json({ id: result._id, ...result.toObject() });
  } catch (err) {
    if (err.message.includes("Missing required fields")) {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    res
      .status(500)
      .json({ message: "Failed to create user", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;

    // Validate required fields
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.phoneNumber ||
      !userData.address ||
      !userData.dateOfBirth
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: firstName, lastName, email, phoneNumber, address, dateOfBirth",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(userData.dateOfBirth)) {
      return res.status(400).json({
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    const result = await User.update(id, userData);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.message.includes("Missing required fields")) {
      return res.status(400).json({ message: err.message });
    }
    res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.remove(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
