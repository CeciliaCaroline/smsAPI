[![Build Status](https://travis-ci.org/CeciliaCaroline/smsAPI.svg?branch=master)](https://travis-ci.org/CeciliaCaroline/smsAPI)
[![Coverage Status](https://coveralls.io/repos/github/CeciliaCaroline/smsAPI/badge.svg?branch=master)](https://coveralls.io/github/CeciliaCaroline/smsAPI?branch=master)

## SMS Management Application API
The SMS Management application is an API that manages contacts as well as the sending and receiving of messages

### Requirements
- Node (8.11.3)
- MongoDB


### Set up
Clone the repository

`https://github.com/CeciliaCaroline/smsAPI.git`

Install dependencies

`npm install`

Start up mongoDB

`mongod`

Start up the server

`npm start`

Use postman to test the api requests on `localhost:8081`.

### Running Tests

You can run the application tests in the terminal with:

`npm test`

### Endpoints

Endpoint | Functionality
------------ | -------------
POST /v1/contacts |Create a new contact
GET /v1/contacts/:contactID | Get contact
UPDATE /v1/contacts/:contactID | Update contact name
DELETE /v1/contacts/:contactID  | Delete contact
POST /v1/contacts/:contactID/messages  | Create/send message
GET /v1/contacts/:contactID/messages/sent | Get sent messages
GET /v1/contacts/:contactID/messages/:messageID | Get specific messages
GET /v1/contacts/:contactID/messages/received | Get received messages
PUT /v1/contacts/:contactID/messages/:messageID | Updates message status
DELETE /v1/contacts/:contactID/messages/:messageID | Deletes message

More detailed documentation of the API can be found [here](https://documenter.getpostman.com/view/2437198/RztppSwD)


