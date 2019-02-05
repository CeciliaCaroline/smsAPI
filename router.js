"use strict";

const express = require("express");
const router = express.Router();
const contacts = require("./controllers/contactController");
const message = require("./controllers/messageController");

//GET contacts
router.get("/contacts", contacts.findAll)

// POST contact
router.post("/contacts", contacts.create);

// GET specific contact
router.get("/contacts/:contactID", contacts.findOne)

// DELETE contact
router.delete("/contacts/:contactID", contacts.delete);


// POST message
router.post("/contacts/:contactID/messages", message.create);

// GET  all received messages
router.get("/contacts/:contactID/messages/received", message.findAllReceived);

// GET  all sent messages
router.get("/contacts/:contactID/messages/sent", message.findAllSent);

// GET specific message
router.get("/contacts/:contactID/messages/:messageID", message.findOne);

// UPDATE message
router.put("/contacts/:contactID/messages/:messageID", message.update);

// DELETE message
router.delete("/contacts/:contactID/messages/:messageID", message.delete)


module.exports = router;
