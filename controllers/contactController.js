const Contact = require("../models/contact").Contact;
const Message = require("../models/message").Message;


// Create and Save a new contact
exports.create = (req, res) => {
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

};

// Retrieve and return all contacts from the database.
exports.findAll = (req, res) => {
    Contact.find()
    .then(contacts => {
      if (!contacts.length){
        res.status(200).send({message: "No contacts have been found", status: "success"})
      }
      res.status = 200;
      res.status(200).send({contacts, status: "success"});
    })
    .catch(error => {
      res.status(500).send({
        message: error.message || "An error occurred while retrieving contacts."
      });
    });
};

// Find a single contact with a contactId
exports.findOne = (req, res) => {
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

};

// Update a contact identified by the contactId in the request
exports.update = (req, res) => {

};

// Delete a contact with the specified contactId in the request
exports.delete = (req, res) => {
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

};