// get dependencies
var Sequelize = require('sequelize');
//sequelize initialization
var sequelize = new Sequelize("postgres://andela:andela@localhost:5432/sequelize");

var schema = require('./schema');
var docManager = require('./documentManager')

describe("Sequelize", function() {

  describe("User", function() {
    beforeEach(function(done) {
      docManager.createUser('ufedo', 'opaluwa', 'Astro').then(function() {
        done();
      });
    });

    afterEach(function(done) {
      schema.Model.prototype.User.destroy({
        where: {}
      }).then(function() {
        schema.Model.prototype.Role.destroy({
          where: {}
        });
        done();
      });
    });

    it("should validate that a user created is unique", function(done) {
      schema.Model.prototype.User.findAndCountAll({
        where: {
          firstName: 'ufedo'
        }
      }).then(function(result) {
        expect(result.count).toBe(1);
        done();
      });
    });

    it("should validate that a new user has a role defined", function(done) {
      schema.Model.prototype.User.findOne({
        where: {
          firstName: 'ufedo'
        }
      }).then(function(user) {
        expect(user.RoleTitle).toBeDefined();
        done();
      });
    });

    it("should validate that a new user created has a first and last name", function(done) {
      schema.Model.prototype.User.findOne({
        where: {
          RoleTitle: 'Astro'
        }
      }).then(function(user) {
        expect(user.firstName).not.toBe(null);
        expect(user.lastName).not.toBe(null);
        done();
      });
    })

    it("should validate that all users are returned when getAllUsers is called.", function(done) {
      docManager.createUser('emeka', 'ashikodi', 'Principal').then(function() {
        docManager.getAllUsers().then(function(users) {
          expect(users[0].firstName).toBe('ufedo');
          expect(users[1].firstName).toBe('emeka');
          expect(users.length).toEqual(2);
          done();
        });
      });
    });
  });

  describe("Role", function() {
    beforeEach(function(done) {
      docManager.createRole('Mascot').then(function() {
        done();
      });
    });

    afterEach(function(done) {
      schema.Model.prototype.Role.destroy({
        where: {}
      });
      done();
    });

    it("should validate that a role created has a unique title", function(done) {
      schema.Model.prototype.Role.findAndCountAll({
        where: {
          title: 'Mascot'
        }
      }).then(function(result) {
        expect(result.count).toBe(1);
        done();
      });
    });

    it("should validate that all roles are returned when getAllRoles is called.", function(done) {
      docManager.createRole('Astro').then(function() {
        docManager.createRole('Peeps').then(function() {
          docManager.getAllRoles().then(function(roles) {
            expect(roles[0].title).toBe('Mascot');
            expect(roles[1].title).toBe('Astro');
            expect(roles[2].title).toBe('Peeps');
            expect(roles.length).toBe(3);
            done();
          });
        });
      });
    });
  });

  describe("Document", function() {
    beforeEach(function(done) {
      docManager.createDocument('engineers', 'admin').then(function() {
        done();
      });

    });

    afterEach(function(done) {
      schema.Model.prototype.Document.destroy({
        where: {}
      }).then(function() {
        schema.Model.prototype.Role.destroy({
          where: {}
        });
        done();
      });
    });

    it("should have a published date defined", function(done) {
      schema.Model.prototype.Document.findOne({
        where: {
          title: 'engineers'
        }
      }).then(function(doc) {
        expect(doc.publishDate).toBeDefined();
        done();
      });
    });

    it("should validate that all documents are returned and are based on limit when getAllDocuments is called.", function(done) {
      docManager.createDocument('pastors', 'secretary').then(function() {
        docManager.createDocument('trainers', 'secretary').then(function() {
          docManager.getAllDocuments(2).then(function(documents) {
            expect(documents[0].title).toBe('trainers');
            expect(documents[1].title).toBe('pastors');
            expect(documents.length).toBe(2);
            done();
          });
        });
      });
    });

    it("should validate that all documents are in descending order when getAllDocuments is called.", function(done) {
      docManager.createDocument('pastors', 'secretary').then(function() {
        docManager.createDocument('trainers', 'documentarian').then(function() {
          docManager.createDocument('wimps', 'secretary').then(function() {
            docManager.getAllDocuments(3).then(function(documents) {
              expect(documents[0].updatedAt).toBeGreaterThan(documents[1].updatedAt);
              expect(documents[2].updatedAt).toBeLessThan(documents[1].updatedAt);
              expect(documents[0].title).toBe('wimps');
              expect(documents[1].title).toBe('trainers');
              expect(documents[2].title).toBe('pastors');
              expect(documents.length).toBe(3)
              done();
            });
          });
        });
      });
    });
  });

  describe("Search", function() {
    beforeEach(function(done) {
      docManager.createDocument('engineers', 'admin').then(function() {
        done();
      });

    });

    afterEach(function(done) {
      schema.Model.prototype.Document.destroy({
        where: {}
      }).then(function() {
        schema.Model.prototype.Role.destroy({
          where: {}
        });
        done();
      });
    });

    it("should validate that all documents belonging to a role are in descending order by date based on limit when getAllDocumentsByRole is called.", function(done) {
      docManager.createDocument('pastors', 'secretary').then(function() {
        docManager.createDocument('trainers', 'documentarian').then(function() {
          docManager.createDocument('wimps', 'secretary').then(function() {
            docManager.getAllDocumentsByRole('secretary', 2).then(function(documents) {
              expect(documents[0].updatedAt).toBeGreaterThan(documents[1].updatedAt);
              expect(documents[0].title).toBe('wimps');
              expect(documents[1].title).toBe('pastors');
              expect(documents.length).toBe(2)
            }).then(function() {
              docManager.getAllDocumentsByRole('admin', 2).then(function(documents) {
                expect(documents[0].title).toBe('engineers');
                expect(documents.length).toBe(1)
                done();
              });
            });
          });
        });
      });
    });

    it("should get all documents created on a date based on a limit when getAllDocumentsByDate is called.", function(done) {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!
      var yyyy = today.getFullYear();
      var currentDate = dd + '-' + mm + '-' + yyyy
      docManager.createDocument('trainers', 'documentarian').then(function() {
        docManager.createDocument('wimps', 'secretary').then(function() {
          docManager.getAllDocumentsByDate(currentDate, 2).then(function(documents) {
            expect(documents[0].title).toBe('wimps');
            expect(documents[1].title).toBe('trainers');
            expect(documents.length).toBe(2)
            done();
          })
        });
      });
    });
  })
});
