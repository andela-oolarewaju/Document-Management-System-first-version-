#! /usr/bin/env node

var docManager = require('./documentManager');
var exec = require('child_process').exec;

var commandInput = process.argv[1];
var path = commandInput.split('/');
var userInput = path[4];
var userArgs = process.argv.slice(2);


switch (userInput !== null) {
  case userInput == "createUser":
    if (userArgs.length !== 3) {
      console.log("Wrong input format! format for create user like : 'createUser first last roleTitle'");
    } else {
      exec(docManager.createUser(userArgs[0], userArgs[1], userArgs[2]).then(function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log(userArgs[0] + ' User has been created');
        }
      }));
    }
    break;
  case userInput == "getAllUsers":
    if (userArgs.length > 0) {
      console.log("Wrong input format! format for get all users like : 'getAllUsers'");
    } else {
      exec(docManager.getAllUsers().then(function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log('All users:', result);
        }
      }));
    }
    break;
  case userInput == "createRole":
    if (userArgs.length !== 1) {
      console.log("Wrong input format! format for create role like : 'createRole roleTitle'");
    } else {
      exec(docManager.createRole(userArgs[0]).then(function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log(userArgs[0] + ' Role has been created');
        }
      }));
    }
    break;
  case userInput == "getAllRoles":
    if (userArgs.length > 0) {
      console.log("Wrong input format! format for get roles like : 'getAllRoles'");
    } else {
      exec(docManager.getAllRoles().then(function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log('All roles:', result);
        }
      }));
    }
    break;
  case userInput == "createDocument":
    if (userArgs.length !== 2) {
      console.log("Wrong input format! format for create documents like : 'createDocument document_Name roleTitle'");
    } else {
      exec(docManager.createDocument(userArgs[0], userArgs[1]).then(function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log('Document has been created');
        }
      }));
    }
    break;
  case userInput == "getAllDocuments":
    if (userArgs.length !== 1) {
      console.log("Wrong input format! format for get all documents with limit : 'getAllDocuments limit'");
    } else {
      exec(docManager.getAllDocuments(userArgs[0]).then(function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log('All documents:', result);
        }
      }));
    }
    break;
  case userInput == "getAllDocumentsByRole":
    if (userArgs.length !== 2) {
      console.log("Wrong input format! format for get all documents by Role with limit : 'getAllDocumentsByRole roleTitle limit'");
    } else {
      exec(docManager.getAllDocumentsByRole(userArgs[0], userArgs[1]).then(function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log('All documents by role:', result);
        }
      }));
    }
    break;
  case userInput == "getAllDocumentsByDate":
    if (userArgs.length !== 2) {
      console.log("Wrong input format! format for get all documents by Date with limit : 'getAllDocumentsByDate dd-mm-yy limit'");
    } else {
      exec(docManager.getAllDocumentsByDate(userArgs[0], userArgs[1]).then(function(err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log('All documents by date:', result);
        }
      }));
    }
    break;
  case userInput == 'help!':
    console.log("To create new user:\t \t\t \t'createUser first last roleTitle'");
    console.log("To get all users:\t \t\t\t'getAllUsers'");
    console.log("To create role like: \t\t\t\t'createRole roleTitle'");
    console.log("To get roles like: \t\t\t\t'getAllRoles'");
    console.log("To create documents like: \t\t \t'createDocument document_Name roleTitle'");
    console.log("To get all documents with limit: \t \t'getAllDocuments limit'");
    console.log("To get all documents by Role with limit: \t'getAllDocumentsByRole roleTitle limit'");
    console.log("To get all documents by Date with limit: \t'getAllDocumentsByDate dd-mm-yy limit'");
    break;
  default:
    console.log("'Command not found, type 'help!'");
}
