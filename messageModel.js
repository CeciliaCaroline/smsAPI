"use strict";
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  sender: String,
  recipient: String,
  status: { type: String, default: "sent" }
});


const Message = mongoose.model("Message", MessageSchema);

module.exports.Message = Message;
