'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema ({
    text: String,
    createdAt: {type: Date, default: Date.now},
    sender: String,
    recipient: String,
    status: {type: String, default: 'sent'}

});


const ContactSchema = new Schema({
    phoneNumnber: {type: Number, unique: true},
    name: String,
    createdAt: {type: Date, default: Date.now},
    messages: [MessageSchema]
});


const Contact = mongoose.model("Contact", ContactSchema);

module.exports.Contact = Contact;