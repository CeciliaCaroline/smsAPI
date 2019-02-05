const Message = require("../models/message").Message;


// Create and Save a new message
exports.create = (req, res) => {
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
          return res.status(201).send(data);
        })
        .catch(err => {
          return res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Message."
          });
        });

};

// Retrieve and return all sent messages from the database.
exports.findAllSent = (req, res) => {
    Message.find({$or : [{ sender: req.params.contactID}]})
  
    .then(messages => {
      if (!messages.length) {
        return res.status(200).send({message: "No Messages have been found"})
      }
      res.status(200).json(messages);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Messages."
      });
    });
};

// Retrieve and return all received messages from the database.
exports.findAllReceived = (req, res) => {
    Message.find({$or : [{ recipient: req.params.contactID}]})
  
    .then(messages => {
      if (!messages.length) {
        return res.status(200).send({message: "No Messages have been found"})
      }
      return res.status(200).json(messages);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Messages."
      });
    });
};

// Find a single message with a messagetId
exports.findOne = (req, res) => {
    Message.findById(req.params.messageID).then(message => {
        if (!message) {
          return res.status(404).send({
            message: `Message with id  ${req.params.messageID} not found`
          });
        }
        res.status(200).json(message)
    
          .catch(err => {
            if (err.kind === "ObjectId") {
              return res.status(404).send({
                message: `Message with id  ${req.params.messageID} not found`
              });
            }
            return res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving the Message."
            });
          });
      });

};

// Update a message identified by the messagetId in the request
exports.update = (req, res) => {
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
        return res.json(message);
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Mesage not found with id " + req.params.messageID
          });
        }
        return res.status(500).send({
          message:
            err.message || "Some error occurred while updating the Message."
        });
      });
};

// Delete a message with the specified messageId in the request
exports.delete = (req, res) => {
    Message.findByIdAndRemove(req.params.messageID)

    .then (() => {
      return res.json({
              message: "Deleted successfully"
            });
    })
    .catch(err => {
      next(err)
      return res.status(500).send({
              message: `Could not delete message with id  ${req.params.messageID}`
            });
    })
};