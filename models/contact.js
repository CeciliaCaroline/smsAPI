'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    phoneNumnber: {type: Number, unique: true},
    name: String,
    createdAt: {type: Date, default: Date.now},
});


const Contact = mongoose.model("Contact", ContactSchema);

module.exports.Contact = Contact;