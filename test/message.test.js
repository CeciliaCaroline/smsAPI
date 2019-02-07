'use strict';

const request = require('supertest');
const app = require('../index'); 
const expect = require('chai').expect;
const mongoose = require('mongoose');
const Contact = require("../models/contact").Contact;
const Message = require("../models/message").Message
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
  
  });
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


describe('Message routes', function() {

  it('should respond with a received message', function(done) {
    request(app)
      .get(`/v1/contacts/${contact._id}/messages/received`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res)  {
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
      .expect(200, function(err, res) {
        if (err) { return done(err); }
        expect(res.body).to.be.an("object");
        done();
      });
  });

  it('should respond with not found', function(done) {
    request(app)
      .get(`/v1/contacts/${contact._id}/messages/1`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, function(err, res) {
        if (err) { return done(err); }
          expect(res.body.message).to.equal("Message with id  1 not found");
          // done
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
      .end( function(err, res) {
        if (err) { return done(err); }
        // Done
        done();
      });
  });

  it('respond with updates message', function (done) {
   console.log(message, contact)
      request(app)
      .put(`/v1/contacts/${contact._id}/${message._id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);

  });

});

