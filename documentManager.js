var Sequelize = require('sequelize');
var schema = require('./schema');

module.exports = {
  //create user function
  createUser: function(first, last, role) {
    //find or create a role then create a user
    return schema.Model.prototype.Role.findOrCreate({
      where: {
        title: role
      }
    }).then(function() {
      return schema.Model.prototype.User.create({
        firstName: first,
        lastName: last,
        RoleTitle: role
      });
    });
  },
  //get all users
  getAllUsers: function() {
    var userLength = 0;
    return schema.Model.prototype.User.findAll().then(function(users) {
      //iterate through users
      for (var key in users) {
        if (users.hasOwnProperty(key)) {
          //increment userLength if users has property key
          ++userLength;
        }
      }
      return userLength;
    });
  },
  //find or create a role
  createRole: function(title) {
    return schema.Model.prototype.Role.findOrCreate({
      where: {
        title: title
      }
    });
  },
  //get all roles
  getAllRoles: function() {
    var roleLength = 0
    return schema.Model.prototype.Role.findAll().then(function(roles) {
      //iterate through roles
      for (var key in roles) {
        if (roles.hasOwnProperty(key)) {
          //increment roleLength if roles has property key
          ++roleLength;
        }
      }
      return roleLength;
    });
  },
  //create a document
  createDocument: function(title, roleTitle) {
    //format date like dd-mm--yy
    var currentDate = new Date();
    currentDate = currentDate.getDay() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear();
    //find or create then create a document and set publish date to current date
    return schema.Model.prototype.Role.findOrCreate({
      where: {
        title: roleTitle
      }
    }).then(function() {
      return schema.Model.prototype.Document.create({
        title: title,
        RoleTitle: roleTitle,
        publishDate: currentDate
      });
    });
  },
  //get all documents
  getAllDocuments: function(limit) {
    var allDocs = [];
    //get docs in descending order by limit
    return schema.Model.prototype.Document.findAll({
      limit: limit,
      order: '"updatedAt" DESC'
    }).then(function(documents) {
      for (var key in documents) {
        if (documents.hasOwnProperty(key)) {
          allDocs.push(documents[key].dataValues);
        }
      }
      return allDocs;
    });
  },
  //get docs by role
  getAllDocumentsByRole: function(role, limit) {
    var allDocs = [];
    return schema.Model.prototype.Document.findAll({
      where: {
        RoleTitle: role
      },
      limit: limit,
      order: '"updatedAt" DESC'
    }).then(function(documents) {
      for (var key in documents) {
        if (documents.hasOwnProperty(key)) {
          allDocs.push(documents[key].dataValues);
        }
      }
      return allDocs;
    });
  },
  //get all docs by date
  getAllDocumentsByDate: function(date, limit) {
    var allDocs = [];
    //get docs created on the date passed by user
    return schema.Model.prototype.Document.findAll({
      where: {
        publishDate: date
      },
      order: '"createdAt" DESC',
      limit: limit
    }).then(function(documents) {
      for (var key in documents) {
        if (documents.hasOwnProperty(key)) {
          allDocs.push(documents[key].dataValues);
        }
      }
      return allDocs;
    });
  }
}
