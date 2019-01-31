"use strict";

const express = require("express");
const router = express.Router();
const Contact = require("./models").Contact;

router.param("contactID", (req, res, next, id) => {
  Contact.findById(id, (err, contact) => {

    if (err) return next(err);
    if (!contact) {
      err = new Error("Data not found");
      err.status = 404;
      return next(err);
    }
    req.contact = contact;
    return next();
  });
});

router.param("messageID", (req, res, next, id) => {
  req.message = req.contact.messages.id(id);
  if (!req.message) {
    err = new Error("Message not found");
    err.status = 404;
    return next(err);
  }
  return next();
  // Message.findById(id, (err, message) => {
  //   if (err) return next(err);
  //   if (!message) {
  //     err = new Error("message not found");
  //     err.status = 404;
  //     return next(err);
  //   }
  //   req.message = message;
  //   return next();
  // });
});

//GET contacts
router.get("/contacts", (req, res) => {
  Contact.find()
  .then(contacts => {
    res.json(contacts)

  })
  .catch(error => {
    res.status(500).send({
      message: err.message || "An error occurred while retrieving contacts."
    })
  })

  // Contact.find({}, (err, contacts) => {
  //   if (err) return next(err);
  //   res.json(contacts);
  // });
});

// POST contact
router.post("/contacts", (req, res, next) => {
  if (!req.body.phoneNumnber || !req.body.name){
    return res.status(400).send({
      message: "Contact phone number or name can not be empty"
  });
  }
  let contact = new Contact(req.body);
  contact.save()
  .then(data => {
    res.json(contact);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Note."
  });
  })

  // contact.save((err, contact) => {
  //   if (err) return next(err);
  //   res.status = 201;
  //   res.json({ contact });
  // });
});

// GET specific contact
router.get("/contacts/:contactID", (req, res) => {
  res.json(req.contact);
});

// DELETE contact
router.delete("/contacts/:contactID", (req, res, next) => {
  req.contact.remove(err => {
    res.json({
      status: "success",
      message: "Contact deleted"
    });
  });
  // })
});

// POST message
router.post("/contacts/:contactID/messages", (req, res, next) => {
  Contact.findById(req.body.recipient, (err, rec) => {
    if (err) return next(err);
    if (!rec) {
      err = new Error("Message not found");
      err.status = 404;
      return next(err);
    }
    rec.messages.push(req.body);
    rec.save((err, received) => {
      if (err) return next(err);
    });
  });

  req.contact.messages.push(req.body);
  req.contact.save((err, contact) => {
    if (err) return next(err);
    res.status = 201;
    res.json(contact.messages[contact.messages.length - 1]);
  });
});

// GET messages sent by contact
router.get("/contacts/:contactID/messages", (req, res, next) => {
  res.json(req.contact.messages);
});

// GET specific message
router.get("/contacts/:contactID/messages/:messageID", (req, res) => {
  res.json(req.message);
});

// GET messages received by contact
router.get("/contacts/:contactID/received", (req, res) => {
  // res.json(req.contact.messages);
  // console.log(req.contact._id, req.contact.messages, "rec");
  // req.contact.messages.find({}, (err, message)=> {
  //   console.log("!!!!!!!!!!!")

  //   if (err) return next(err)
  //   // if (!rec){
  //   //   err = new Error('Message not found');
  //   //   err.status = 404;
  //   //   return next(err);
  //   // }
  //   res.json(message)
  // })
});

// UPDATE message
router.put("/contacts/:contactID/messages/:messageID", (req, res) => {
  req.message.status = req.body.status;
  req.message.save(err => {
    if (err) return next(err);
    res.json(req.message);
  });
});

// DELETE message
router.delete("/contacts/:contactID/messages/:messageID", (req, res) => {
  req.message.remove(err => {
    if (err) return next(err);
    res.json({
      status: "success",
      message: "Contact deleted"
    });
  });
});

module.exports = router;
