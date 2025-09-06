const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  ipaddress: { type: String, required: true }
});

const Contact = mongoose.model('Contact', contactSchema);

const getAll = async () => {
  return Contact.find();
};

const getById = async (id) => {
  return Contact.findById(id);
};

const create = async (contact) => {
  const { name, email, username, ipaddress } = contact;
  if (!name || !email || !username || !ipaddress) {
    throw new Error('Missing required fields: name, email, username, ipaddress');
  }
  const newContact = new Contact({ name, email, username, ipaddress });
  return newContact.save();
};

module.exports = { 
  getAll,
  getById,
  create
};
