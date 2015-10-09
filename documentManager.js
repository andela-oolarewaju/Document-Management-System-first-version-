var Sequelize = require('sequelize');
var schema = require('./schema');
//sequelize initialization
var sequelize = new Sequelize("postgres://andela:andela@localhost:5432/firstVersion");
var DocumentManager = function(){}

DocumentManager.prototype.createUser = function(first, last, role) {
  schema.Model.prototype.Role.findOrCreate({
	  where : {
		  title : role
		}
	}).then(function (){
		return schema.Model.prototype.User.create({
      firstName : first,
      lastName: last,
      RoleTitle: role
		});	
	}); 
}

DocumentManager.prototype.getAllUsers = function() {
	var userLength = 0;
  return schema.Model.prototype.User.findAll().then(function (users) {
  	for (var key in users){
    	if(users.hasOwnProperty(key)){
    		++userLength;
    	}
    }
    return userLength;
  });
};

DocumentManager.prototype.createRole = function(title) {
	var newRole = {
    title : title
  }
  return schema.Model.prototype.Role.create(newRole).then(function () {
      console.log(newRole)
  });
}

DocumentManager.prototype.getAllRoles = function() {
	var roleLength = 0
  return schema.Model.prototype.Role.findAll().then(function (roles) {
    for (var key in roles){
    	if(roles.hasOwnProperty(key)){
    		++roleLength;
    	}
    }
    return roleLength;
  });
};

DocumentManager.prototype.createDocument = function(title, roleTitle, userFirstName, userLastName ) {
	schema.Model.prototype.Role.findOrCreate({
	  where : {
		  title : roleTitle
		}
	}).then(function(){
		schema.Model.prototype.User.findOrCreate({
			where : {
				firstName : userFirstName,
				lastName : userLastName,
				RoleTitle : roleTitle
			}
		}).then(function() {
			return schema.Model.prototype.Document.create({
				title : title,
				RoleTitle : roleTitle,
				UserFirstName : userFirstName,
			});
		})
	});
}

DocumentManager.prototype.getAllDocuments = function(limit) {
	var allDocs = [];
  return schema.Model.prototype.Document.findAll({
  	limit : limit,
  	order : '"updatedAt" DESC'
  }).then(function (documents) {
  	for(var key in documents) {
      if(documents.hasOwnProperty(key)){
      	allDocs.push(documents[key].dataValues);
      }
    }
     return allDocs; 
  });
};

DocumentManager.prototype.getAllDocumentsByRole = function(role, limit) {
	var allDocs = [];
  return schema.Model.prototype.Document.findAll({ where : {
  	RoleTitle : role
  },
  	limit : limit,
  	order : '"updatedAt" DESC'
  }).then(function (documents) {
  	console.log("doc", documents);
  	for(var key in documents) {
      if(documents.hasOwnProperty(key)){
      	allDocs.push(documents[key].dataValues);
      }
    }
     return allDocs; 
  });
};

DocumentManager.prototype.getAllDocumentsByDate = function(date, limit) {
	var allDocs = [];
  return schema.Model.prototype.Document.findAll({ where : {
  	createdAt : date
  },
  	limit : limit,
  	order : '"createdAt" DESC'
  }).then(function (documents) {
  	for(var key in documents) {
      if(documents.hasOwnProperty(key)){
      	allDocs.push(documents[key].dataValues);
      }
    }
      console.log("docs:", allDocs);
      return allDocs;
  });
};

exports.DocumentManager = DocumentManager;