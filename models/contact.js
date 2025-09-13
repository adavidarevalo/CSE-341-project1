const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  favoriteColor: { type: String, required: true },
  birthday: { type: Date, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

const getAll = async () => {
  return Contact.find();
};

const getById = async (id) => {
  return Contact.findById(id);
};

const create = async (contact) => {
  const { firstName, lastName, email, favoriteColor, birthday } = contact;
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    throw new Error(
      "Missing required fields: firstName, lastName, email, favoriteColor, birthday"
    );
  }
  const newContact = new Contact({
    firstName,
    lastName,
    email,
    favoriteColor,
    birthday,
  });
  return newContact.save();
};

const update = async (id, contact) => {
  const { firstName, lastName, email, favoriteColor, birthday } = contact;
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    throw new Error(
      "Missing required fields: firstName, lastName, email, favoriteColor, birthday"
    );
  }
  return Contact.findByIdAndUpdate(
    id,
    { firstName, lastName, email, favoriteColor, birthday },
    { new: true }
  );
};

const remove = async (id) => {
  return Contact.findByIdAndDelete(id);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
