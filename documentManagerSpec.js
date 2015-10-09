var schema = require('./schema');
var docManager = require('./documentManager')

describe("Sequelize", function() {
  beforeEach(function(done){
  	docManager.DocumentManager.prototype.createUser('ufedo', 'opaluwa', 'Astro');
	  docManager.DocumentManager.prototype.createUser('emeka', 'ashikodi', 'Principal');
		docManager.DocumentManager.prototype.createRole('Mascot');
		docManager.DocumentManager.prototype.createRole('Astro');
		docManager.DocumentManager.prototype.createRole('Peeps');
	  docManager.DocumentManager.prototype.createDocument('engineers', 'admin', 'toyin', 'lasma');
	  docManager.DocumentManager.prototype.createDocument('pastors', 'secretary', 'bisoye', 'atolagbe');
	  docManager.DocumentManager.prototype.createDocument('trainers', 'secretary', 'daisi', 'omowemo');
	  docManager.DocumentManager.prototype.createDocument('wimps', 'secretary', 'susan', 'adelokiki');
    done();
  });
  
  describe("User", function() {
		it("should validate that a user created is unique", function (done) {
	    schema.Model.prototype.User.findAndCountAll({ 
	    	where : { 
	    		firstName : 'ufedo'
	    	}
	    }).then(function(result) {
	    	expect(result.count).toBe(1); 
	    	done();
	    });
		});

		it("should validate that a new user has a role defined", function (done) {
			schema.Model.prototype.User.findOne({
				where: {
					firstName : 'emeka'
				}
			}).then(function(user) {
				expect(user.RoleTitle).toBeDefined();
				done();
			});
		});

		it("should validate that a new user created has a first and last name", function (done) {
			schema.Model.prototype.User.findOne({
				where: {
					RoleTitle : 'Principal'
				}
			}).then(function(user) {
				expect(user.firstName).not.toBe(null);
				expect(user.lastName).not.toBe(null);
				done();
			});
		})
		
		it("should validate that all users are returned when getAllUsers is called.", function (done) {
			docManager.DocumentManager.prototype.getAllUsers().then(function(users) {
				expect(users).toBe(6);
				done();
			});
		})
	});

	describe("Role", function() {
		
		it("should validate that a role created has a unique title", function (done) {
	    schema.Model.prototype.Role.findAndCountAll({ 
	    	where : { 
	    		title : 'Peeps'
	    	}
	    }).then(function(result) {
	    	expect(result.count).toBe(1);
	      done();
	    });
		});
	  
		it("should validate that all roles are returned when getAllRoles is called.", function (done) {
			docManager.DocumentManager.prototype.getAllRoles().then(function(roles) {
				expect(roles).toBe(6);
				done();
			});
		})
	});

  describe("Document", function() {
  	it("should have a published date defined", function (done) {
  		schema.Model.prototype.Document.findOne({
  			where: {
  				title: 'engineers'
  			}
  		}).then(function(doc) {
  			expect(doc.createdAt).toBeDefined();
  			done();
  		});
  	});

  	it("should validate that all documents are returned and are based on limit when getAllDocuments is called.", function (done) {
			docManager.DocumentManager.prototype.getAllDocuments(2).then(function(documents) {
				expect(documents[0].title).toBe('trainers');
				expect(documents[1].title).toBe('pastors');
				expect(documents.length).toBe(2);
				done();
			});
		});

		it("should validate that all documents are in descending order when getAllDocuments is called.", function (done) {
			docManager.DocumentManager.prototype.getAllDocuments(3).then(function(documents) {
				expect(documents[0].updatedAt > documents[1].updatedAt).toBe(true);
				expect(documents[1].updatedAt > documents[2].updatedAt).toBe(true);
				expect(documents[1].updatedAt < documents[2].updatedAt).toBe(false);
				done();
			});
		});
  });

  describe("Search", function() {
  	it("should validate that all documents belonging to a role are in descending order by date based on limit when getAllDocumentsByRole is called.", function (done) {
			docManager.DocumentManager.prototype.getAllDocumentsByRole('secretary', 3).then(function(documents) {
				expect(documents[0].updatedAt > documents[1].updatedAt).toBe(true);
				expect(documents[1].updatedAt < documents[2].updatedAt).toBe(false);
				expect(documents.length).toBe(3);
				done();
			});
		});

		// it("should validate that all documents are returned in descending order by date based on limit when getAllDocumentsByDate is called.", function (done) {
		// 	docManager.DocumentManager.prototype.getAllDocumentsByDate('09/10/2015', 3).then(function(documents) {
		// 		expect(documents[0].createdAt > documents[1].createdAt).toBe(true);
		// 		expect(documents[1].createdAt < documents[2].createdAt).toBe(false);
		// 		expect(documents.length).toBe(3);
		// 		done();
		// 	});
		// });
  })
});