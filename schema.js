//require sequelize
var Sequelize = require('sequelize');
//sequelize initialization
var sequelize = new Sequelize("postgres://andela:andela@localhost:5432/sequelize");
//function to attach methods
var Model = function() {}
Model.prototype.User = sequelize.define('User', {
  firstName: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

Model.prototype.Document = sequelize.define('Document', {
  title: {
    type: Sequelize.STRING,
    unique: true,
    primaryKey: true,
    allowNull: false
  },
  publishDate: Sequelize.STRING
});

Model.prototype.Role = sequelize.define('Role', {
  title: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false
  }
});
//associate document with role. creates a roleTile field in document table
Model.prototype.Role.hasMany(Model.prototype.Document)

//associate user with role. create a roleTitle field in user table
Model.prototype.Role.hasOne(Model.prototype.User, {
  foreignKey: {
    allowNull: false
  }
});

sequelize.sync().then(function() {
  return [Model.prototype.User, Model.prototype.Document, Model.prototype.Role];
});

exports.Model = Model
