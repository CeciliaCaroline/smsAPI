const request = require('supertest')


exports.AddContact = (app, contact) => {
  return request(app)
    .post('/v1/contacts')
    .send(contact)
    .set('Content-Type', 'application/json')
}

// before(function(done) {
//   // set up here
//   const contact1 = {
//     phoneNumnber: 1234123,
//     name: "Angel"
//   };
//   const contact = AddContact(app, contact1);
//   contactId = contact.body.data._id;

//   done();
// });

// after(function(done) {
//   mongoose.connect("mongodb://localhost:27017/testSmsManager");
//   mongoose.connection.once("connected", () => {
//     mongoose.connection.db.dropDatabase();
//     done();
//   });
// });
