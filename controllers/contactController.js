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
          return res.status(201).send({data, message: "Contact successfully created"});
    
        })
        .catch(err => {
          if (err.code === 11000) {
            return res.status(400).send({
              message:
                "The given phone number already exists."
            });
          }
          return res.status(500).json({
            message:
              err.message || "Some error occurred while creating the Contact."
          });
        });

};

// Update a contact identified by the contactId in the request
exports.update = (req, res) => {
  Contact.findByIdAndUpdate(
      req.params.contactID,
      {
        name: req.body.name 
      },
      { new: true }
    )
  
    .then(contact => {
      if (!contact) {
        return res.status(404).send({
          message: `Contact with id  ${req.params.contactID} not found`
        });
      }
      return res.json(contact);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Contact not found with id " + req.params.contactID
        });
      }
      return res.status(500).send({
        message:
          err.message || "Some error occurred while updating theContact."
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


// Delete a contact with the specified contactId in the request
exports.delete = (req, res) => {
    Contact.findByIdAndRemove(req.params.contactID, (err, doc) => {
        // delete all messages sent by contact
        Message.deleteMany({sender: req.params.contactID})
        // Message.updateMany({recipient: req.params.contactID},{ recipient: 'deleted user'})
        .then (() => {
          return res.json({
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