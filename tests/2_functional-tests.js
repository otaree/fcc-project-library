/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var ObjectId = require('mongodb').ObjectId;

chai.use(chaiHttp);

let bookId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {

      chai.request(server)
        .post('/api/books')
        .send({
          title: "Test Title"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id', 'body should contain _id');
          assert.equal(res.body.title, "Test Title");
          bookId = res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {

        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.failed, "Please provide title");
          done();
        });

      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
        //done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const id = ObjectId();
        chai.request(server)
        .get(`/api/books/${id}`)
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.body.failed, `${id} is invalid`)
          done();
        });
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${bookId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'body should contain title');
          assert.property(res.body, 'comments', 'body should contain comments');
          assert.isArray(res.body.comments);
          done();
        });
        //done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){

        chai.request(server)
        .post(`/api/books/${bookId}`)
        .send({
          comment: "Nice read"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'body should contain title');
          assert.equal(res.body._id, bookId);
          assert.include(res.body.comments, "Nice read");
          done();
        });

        //done();
      });
      
    });

  });

});
