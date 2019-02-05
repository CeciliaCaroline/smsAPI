'use strict';

const request = require('supertest');
const app = require('../index'); 
const expect = require('chai').expect;
const mongoose = require('mongoose');
const Contact = require("../models/contact").Contact;
let contact;


beforeEach(function(done) {
  mongoose.connect('mongodb://localhost:27017/testSmsManager');
  mongoose.connection.once('connected', () => {
    mongoose.connection.db.dropDatabase();
    contact = new Contact({
      "phoneNumnber": 1234123,
      "name": "Angel",
    })
    contact.save()

    done();
  });
});

// afterEach(function(done) {
//   mongoose.disconnect();
//   done();
// });


const contact1 = {
  "phoneNumnber": 1234123,
  "name": "Angel",
}

describe('GET /contacts', function() {

  it('should respond with a status as success', function(done) {
    request(app)
      .get('/v1/contacts')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res) {
        if (err) { return done(err); }
        expect(res.body.status).to.equal("success");
        done();
      });
  });

});

describe('GET /contacts/:contactID', function () {

  it('respond with json containing a single user', function (done) {
    let contact = new Contact({
      "phoneNumnber": 1234123,
      "name": "Angel",
    })
    contact.save(err => {
      request(app)
      .get(`/v1/contacts/${contact._id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
    })
  
  });
});

  it('respond with user not found', function (done) {
      request(app)
          .get(`/v1/contacts/1`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404, function(err, res) {
            if (err) { return done(err); }
              expect(res.body.message).to.equal("Contact with id  1 not found");
              // done
              done();
          });
  });

describe('POST /v1/contacts', function() {

  it('should respond with 201 created', function(done) {
    request(app)
      .post('/v1/contacts')
      .send(contact1)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end( function(err, res) {
        if (err) { return done(err); }
        // Done
        done();
      });
  });

  let contact = {
    "name":"Angel"
  }
  it('should respond with 400 not created', function(done) {
    request(app)
      .post('/v1/contacts')
      .send(contact)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, function(err, res) {
        if (err) { return done(err); }
        expect(res.body.message).to.equal("Contact phone number or name can not be empty");

        // Done
        done();
      });
  });

});

describe('DELETE /v1/contacts/:contactID', function () {

  it('respond with Deleted successfully', function (done) {
      request(app)
      .delete(`/v1/contacts/${contact.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
    })
  });

// after(function(done) {
//   mongoose.connect("mongodb://localhost:27017/testSmsManager");
//   mongoose.connection.once("connected", () => {
//     mongoose.connection.db.dropDatabase();
//     done();
//   });
// });