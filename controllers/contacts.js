const { ObjectId } = require("mongodb");
const Contact = require("../models/contact");

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.getAll();
    res.status(200).json(contacts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch contacts", error: err.message });
  }
};

const getContactById = async (req, res) => {
  try {
    const id = req.params.id;
    const contact = await Contact.getById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch contact", error: err.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = req.body;
    const result = await Contact.create(contact);
    res.status(201).json({ id: result._id, ...result.toObject() });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create contact", error: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const id = req.params.id;
    const contact = req.body;
    const result = await Contact.update(id, contact);
    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update contact", error: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Contact.remove(id);
    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete contact", error: err.message });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
