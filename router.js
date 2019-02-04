"use strict";

const express = require("express");
const router = express.Router();
const Contact = require("./models").Contact;
const Message = require("./messageModel").Message;

//GET contacts
router.get("/contacts", (req, res) => {
  Contact.find()
    .then(contacts => {
      if (!contacts.length){
        res.status(200).send({message: "No contacts have been found", status: "success"})
      }
      res.status = 200;
      res.status(200).send({contacts, status: "success"});
    })
    .catch(error => {
      console.log(error)
      res.status(500).send({
        message: error.message || "An error occurred while retrieving contacts."
      });
    });
});

// POST contact
router.post("/contacts", (req, res) => {
  if (!req.body.phoneNumnber || !req.body.name) {
    return res.status(400).send({
      message: "Contact phone number or name can not be empty"
    });
  }
  let contact = new Contact(req.body);
  contact
    .save()
    .then(data => {
      res.status(201).send({data, message: "Contact successfully created"});

    })
    .catch(err => {
      if (err.code === 11000) {
        res.status(400).send({
          message:
            "The given phone number already exists."
        });
      }
      res.status(500).json({
        message:
          err.message || "Some error occurred while creating the Contact."
      });
    });
});

// GET specific contact
router.get("/contacts/:contactID", (req, res) => {
  Contact.findById(req.params.contactID)
    .then(contact => {
      if (!contact) {
        return res.status(404).send({
          message: `Contact with id  ${req.params.contactID} not found`
        });
      }
      res.status(200).send(contact);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: `Contact with id  ${req.params.contactID} not found`
        });
      }
      return res.status(500).send({
        message: "Error retrieving contact with id " + req.params.contactID
    });
});
})

// DELETE contact
router.delete("/contacts/:contactID", (req, res) => {
  Contact.findByIdAndRemove(req.params.contactID, (err, doc) => {
    // delete all messages sent by contact
    Message.deleteMany({sender: req.params.contactID})
    // Message.updateMany({recipient: req.params.contactID},{ recipient: 'deleted user'})
    .then (() => {
      res.json({
              message: "Deleted successfully"
            });
    })
    .catch(err => {
      // next(err)
      if (err.kind === "ObjectId" || err.name === "NotFound") {
              return res.status(404).send({
                message: `Contact with id  ${req.params.contactID} not found`
              });
            }
            return res.status(500).send({
              message: `Could not delete contact with id  ${req.params.contactID}`
            });
    })
    // update references to contact

    Message.updateMany({recipient: req.params.contactID, recipient: 'deleted user'})
  })

});

// POST message
router.post("/contacts/:contactID/messages", (req, res) => {
  if (!req.body.text || !req.body.recipient) {
    return res.status(400).send({
      message: "Message text/sender.recipient can not be empty"
    });
  }
  if (req.params.contactID){

  }
  let message = new Message({...req.body, sender: req.params.contactID});
  message
    .save()
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Message."
      });
    });
});

// GET  all received messages
router.get("/contacts/:contactID/messages/received", (req, res) => {
  Message.find({$or : [{ recipient: req.params.contactID}]})
  
    .then(messages => {
      if (!messages.length) {
        res.status = 404;
        res.send({message: "No Messages have been found"})
      }
      res.status = 200;
      res.json(messages);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Messages."
      });
    });
});

// GET  all sent messages
router.get("/contacts/:contactID/messages/sent", (req, res) => {
  Message.find({$or : [{ sender: req.params.contactID}]})
  
    .then(messages => {
      if (!messages.length) {
        res.status = 404;
        res.send({message: "No Messages have been found"})
      }
      res.status = 200;
      res.json(messages);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Messages."
      });
    });
});

// GET specific message
router.get("/contacts/:contactID/messages/:messageID", (req, res) => {
  Message.findById(req.params.messageID).then(message => {
    if (!message) {
      return res.status(404).send({
        message: `Message with id  ${req.params.messageID} not found`
      });
    }
    res.status = 200;
    res.json(message)

      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: `Message with id  ${req.params.messageID} not found`
          });
        }
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving the Message."
        });
      });
  });
});

// UPDATE message
router.put("/contacts/:contactID/messages/:messageID", (req, res) => {
  Message.findByIdAndUpdate(
      req.params.messageID,
      {
        status: "delivered"
      },
      { new: true }
    )
  
    .then(message => {
      if (!message) {
        return res.status(404).send({
          message: `Message with id  ${req.params.messageID} not found`
        });
      }
      res.json(message);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Mesage not found with id " + req.params.messageID
        });
      }
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating the Message."
      });
    });
});

// DELETE message
router.delete("/contacts/:contactID/messages/:messageID", (req, res) => {
  Message.findByIdAndRemove(req.params.messageID)

    .then (() => {
      res.json({
              message: "Deleted successfully"
            });
    })
    .catch(err => {
      next(err)
      return res.status(500).send({
              message: `Could not delete message with id  ${req.params.messageID}`
            });
    })

  })


module.exports = router;
