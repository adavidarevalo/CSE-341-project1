const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  googleId: { type: String, unique: true, sparse: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

const getAll = async () => {
  return User.find();
};

const getById = async (id) => {
  return User.findById(id);
};

const getByEmail = async (email) => {
  return User.findOne({ email });
};

const getByGoogleId = async (googleId) => {
  return User.findOne({ googleId });
};

const create = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    dateOfBirth,
  } = userData;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !address ||
    !dateOfBirth
  ) {
    throw new Error(
      "Missing required fields: firstName, lastName, email, password, phoneNumber, address, dateOfBirth"
    );
  }

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    dateOfBirth,
  });

  return newUser.save();
};

const update = async (id, userData) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    dateOfBirth,
    isActive,
  } = userData;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !address ||
    !dateOfBirth
  ) {
    throw new Error(
      "Missing required fields: firstName, lastName, email, phoneNumber, address, dateOfBirth"
    );
  }

  return User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      dateOfBirth,
      isActive,
      updatedAt: new Date(),
    },
    { new: true }
  );
};

const remove = async (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  User,
  getAll,
  getById,
  getByEmail,
  getByGoogleId,
  create,
  update,
  remove,
};
