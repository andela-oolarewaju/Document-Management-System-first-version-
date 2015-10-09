// get dependencies
var Sequelize = require('sequelize');
//sequelize initialization
var sequelize = new Sequelize("postgres://andela:andela@localhost:5432/sequelize");

var Model = function () {}
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
		}
	});

	Model.prototype.Role = sequelize.define('Role', {
		title: {
			type: Sequelize.STRING,
			primaryKey: true,
			unique: true,
			allowNull: false
		}
	});
	//associate document with role
	Model.prototype.Role.hasMany(Model.prototype.Document)
	//associate document and user
	Model.prototype.User.hasOne(Model.prototype.Document, {
	  foreignKey: {
	    allowNull: false
	  }
	});
	//associate user with role
	Model.prototype.Role.hasOne(Model.prototype.User,  {
	  foreignKey: {
	    allowNull: false
	  }
	});

	sequelize.sync().then(function() {
		return [Model.prototype.User, Model.prototype.Document, Model.prototype.Role];
	});
	
exports.Model = Model
