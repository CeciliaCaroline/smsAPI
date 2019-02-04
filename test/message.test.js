'use strict';

const request = require('supertest');
const app = require('../index'); 
const expect = require('chai').expect;
const mongoose = require('mongoose');
const Contact = require("../models").Contact;
const Message = require("../messageModel").Message
let contact;
let message;

const message1 = {
    "text": "Message number 22",
    "recipient": "5c55e05215553abacfa3faff"
  }
beforeEach(function(done) {
  mongoose.connect('mongodb://localhost:27017/testSmsManager');
  mongoose.connection.once('connected', () => {
    mongoose.connection.db.dropDatabase();
    contact = new Contact({
      "phoneNumnber": 1234123,
      "name": "Angel",
    })
    contact.save()

    message = new Message({
        "text": "Message number 5",
        "recipient": "5c55e05215553abacfa3faff"
      })
      message.save()
    done();
  });
});

// afterEach(function(done) {
//   mongoose.disconnect();
//   done();
// });



describe('Message routes', function() {

  it('should respond with a received message', function(done) {
    request(app)
      .get(`/v1/contacts/${contact._id}/messages/received`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) { return done(err); }
        expect(res.body).to.be.an("object");
        done();
      });
  });

  it('should respond with a sent message', function(done) {
    request(app)
      .get(`/v1/contacts/${contact._id}/messages/sent`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) { return done(err); }
        expect(res.body).to.be.an("object");
        done();
      });
  });

    it('should respond with 201 created', function(done) {
    request(app)
      .post(`/v1/contacts/${contact.id}/messages`)
      .send(message1)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end( (err, res) => {
        if (err) { return done(err); }
        // Done
        done();
      });
  });

});

