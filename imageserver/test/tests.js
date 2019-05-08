const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = null;
const path = require('path');
var nock = require('nock');

const directory = 'public/uploads';

chai.use(chaiHttp);
chai.should();

var sinon = require("sinon");

var server;

describe("Test File Upload", () => {
        // Test to get all students record
        it("Upload test file with right extension", (done) => {
            chai.request(app)
                .post('/upload')
                .attach('sampleFile','test/test.jpg','test.jpg')
                .type('form')
                .end((err, res) => {
                    //check status code
                    res.should.have.status(200);
                    //file created
                    fs.readdir(directory, (err, files) => {
                        if (err) throw err;
                        chai.expect(files.length-1).to.be.equal(1);
                        done();
                    });    
            });
        });

        it("Upload file with wrong format",(done)=>{
            chai.request(app)
                .post('/upload')
                .attach('sampleFile','test/hacker.sh','hacker.sh')
                .type('form')
                .end((err, res) => {
                    //check status code
                    res.should.have.status(400);
                    //file created
                    done();    
            });
        });

        it("Upload nothing",(done)=>{
            chai.request(app)
                .post('/upload')
                .type('form')
                .send({})
                .end((err, res) => {
                    //check status code
                    res.should.have.status(400);
                    //file created
                    done();    
            });
        });

        beforeEach(function(done){
            db.run('DELETE FROM movements',[],function(err){
                done();
            });
        });

        afterEach(function(done){
            //delete from filesystem
            setTimeout(function(){
                fs.readdir(directory, (err, files) => {
                    if (err) throw err;
                  
                    for (const file of files) {
                      if (file != '.keep'){
                        fs.unlinkSync(path.join(directory, file));
                      }
                      
                    }
                    
                    db.run('DELETE FROM movements',[],function(err){
                        done();
                    });
                    
                  });
            },1000);
             
            
        });

        before((done)=>{
            db= new sqlite3.Database('./movements.db',done);
        });

        after((done)=>{
            db.close(()=>{
                done();
            });
        });
});


describe("Test /movements route", () => {
    // Test to get all students record
    it("Empty array if no movements", (done) => {
        chai.request(app)
            .get('/movements')
            .end((err, res) => {
                //check status code
                res.should.have.status(200);
                //response is empty array
                console.log(res.text);
                var res = JSON.parse(res.text);
                chai.expect(res.movements).not.undefined;
                chai.expect(res.movements.length).to.be.equal(0);
                done();   
        });
    });

    // Test to get all students record
    it("One movement in db", (done) => {
        //insert a movement
        db.run('INSERT INTO movements(date_time, path, image,is_new) VALUES(?, ?, ?, ?)', ['2019-03-27_09-56-11', '/justanurl', 'test', 1], (err) => {
            if(err) {
                throw err;
            }
            chai.request(app)
            .get('/movements')
            .end((err, res) => {
                //check status code
                res.should.have.status(200);
                //response has the movement inserted before
                var res = JSON.parse(res.text);
                chai.expect(res.movements).not.undefined;
                chai.expect(res.movements.length).to.be.equal(1);
                var movement = res.movements[0];
                chai.expect(movement).to.deep.equal({is_new: "1", timestamp:'2019-03-27_09-56-11', url:'/uploads/test', path:'/justanurl'})
                done();   
            });
        })
    });

    // Test to get all students record
    it("Movement first read, second read", (done) => {
        //insert a movement
        db.run('INSERT INTO movements(date_time, path, image,is_new) VALUES(?, ?, ?, ?)', ['2019-03-27_09-56-11', '/justanurl', 'test', 1], (err) => {
            if(err) {
                throw err;
            }
            chai.request(app)
            .get('/movements')
            .end((err, res) => {
                //check status code
                res.should.have.status(200);
                //response has the movement inserted before
                var res = JSON.parse(res.text);
                chai.expect(res.movements).not.undefined;
                chai.expect(res.movements.length).to.be.equal(1);
                var movement = res.movements[0];
                chai.expect(movement).to.deep.equal({is_new: "1", timestamp:'2019-03-27_09-56-11', url:'/uploads/test', path:'/justanurl'})
                

                chai.request(app)
                .get('/movements')
                .end((err, res) => {
                    //check status code
                    res.should.have.status(200);
                    //response has the movement inserted before
                    var res = JSON.parse(res.text);
                    chai.expect(res.movements).not.undefined;
                    chai.expect(res.movements.length).to.be.equal(1);
                    var movement = res.movements[0];
                    chai.expect(movement).to.deep.equal({is_new: "0", timestamp:'2019-03-27_09-56-11', url:'/uploads/test', path:'/justanurl'})
                    done();
                });
            });
        })
    });
    
    beforeEach(function(done){
        db.run('DELETE FROM movements',[],function(err){
            done();
        });
    });

    afterEach(function(done){
        //delete from filesystem
        setTimeout(function(){    
            db.run('DELETE FROM movements',[],function(err){
                done();
            });
        },1000);
         
        
    });

    before((done)=>{
        db= new sqlite3.Database('./movements.db',done);
    });

    after((done)=>{
        db.close(()=>{
            done();
        });
    });
});


describe("Test /newmovements route", () => {
    // Test to get all students record
    it("Empty array if no new movements", (done) => {
        chai.request(app)
            .get('/newmovements')
            .end((err, res) => {
                //check status code
                res.should.have.status(200);
                //response is empty array
                console.log(res.text);
                var res = JSON.parse(res.text);
                chai.expect(res.movements).not.undefined;
                chai.expect(res.movements.length).to.be.equal(0);
                done();   
        });
    });

    // Test to get all students record
    it("One new movement in db", (done) => {
        //insert a movement
        db.run('INSERT INTO movements(date_time, path, image,is_new) VALUES(?, ?, ?, ?)', ['2019-03-27_09-56-11', '/justanurl', 'test', 1], (err) => {
            if(err) {
                throw err;
            }
            chai.request(app)
            .get('/newmovements')
            .end((err, res) => {
                //check status code
                res.should.have.status(200);
                //response has the movement inserted before
                var res = JSON.parse(res.text);
                chai.expect(res.movements).not.undefined;
                chai.expect(res.movements.length).to.be.equal(1);
                var movement = res.movements[0];
                chai.expect(movement).to.deep.equal({is_new: "1", timestamp:'2019-03-27_09-56-11', url:'/uploads/test', path:'/justanurl'})
                done();   
            });
        })
    });

    // Test to get all students record
    it("new Movement first read, second read", (done) => {
        //insert a movement
        db.run('INSERT INTO movements(date_time, path, image,is_new) VALUES(?, ?, ?, ?)', ['2019-03-27_09-56-11', '/justanurl', 'test', 1], (err) => {
            if(err) {
                throw err;
            }
            chai.request(app)
            .get('/newmovements')
            .end((err, res) => {
                //check status code
                res.should.have.status(200);
                //response has the movement inserted before
                var res = JSON.parse(res.text);
                chai.expect(res.movements).not.undefined;
                chai.expect(res.movements.length).to.be.equal(1);
                var movement = res.movements[0];
                chai.expect(movement).to.deep.equal({is_new: "1", timestamp:'2019-03-27_09-56-11', url:'/uploads/test', path:'/justanurl'})
                

                chai.request(app)
                .get('/newmovements')
                .end((err, res) => {
                    //check status code
                    res.should.have.status(200);
                    //response has the movement inserted before
                    var res = JSON.parse(res.text);
                    chai.expect(res.movements).not.undefined;
                    chai.expect(res.movements.length).to.be.equal(0);
		    //var movement = res.movements[0];
                    //chai.expect(movement).to.deep.equal({is_new: "1", timestamp:'2019-03-27_09-56-11', url:'/uploads/test', path:'/justanurl'})
                    done();
                });
            });
        })
    });
    
    beforeEach(function(done){
        db.run('DELETE FROM movements',[],function(err){
            done();
        });
    });

    afterEach(function(done){
        //delete from filesystem
        setTimeout(function(){    
            db.run('DELETE FROM movements',[],function(err){
                done();
            });
        },1000);
         
        
    });

    before((done)=>{
        db= new sqlite3.Database('./movements.db',done);
    });

    after((done)=>{
        db.close(()=>{
            done();
        });
    });
});

describe("Test /stats route ", () => {

     it("Empty array if no new movements", (done) => {
        chai.request(app)
            .get('/stats')
            .end((err, res) => {
                //check status code
                res.should.have.status(200);
                //response is empty array
                console.log(res.text);
                var res = JSON.parse(res.text);
                chai.expect(res.movements).not.undefined;
                chai.expect(res.movements).to.be.equal("0");
                done();   
        });
    });

    beforeEach(function(done){
        db.run('DELETE FROM movements',[],function(err){
            done();
        });
    });

    afterEach(function(done){
        //delete from filesystem
        setTimeout(function(){    
            db.run('DELETE FROM movements',[],function(err){
                done();
            });
        },1000);
         
        
    });

    before((done)=>{
        db= new sqlite3.Database('./movements.db',done);
    });

    after((done)=>{
        db.close(()=>{
            done();
        });
    });
});

describe("Status routes", (done)=>{
    before(function () { server = sinon.fakeServer.create(); });
    after(function () { server.restore(); });

    it("Get /camera, server respons with on", function (done) {

        // Set up an interceptor
        nock('http://192.168.66.3:5000')
            .get('/status')
            .reply(200, { status: 'on' });

        chai.request(app)
            .get('/camera')
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                console.log(res.text);
                chai.expect(res.text).to.be.equal('ON');
                done();
            });

    });

    it("Get /camera, server respons with off", function (done) {

        // Set up an interceptor
        nock('http://192.168.66.3:5000')
            .get('/status')
            .reply(200, { status: 'off' });

        chai.request(app)
            .get('/camera')
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                console.log(res.text);
                chai.expect(res.text).to.be.equal('OFF');
                done();
            });

    });

    it("Get /camera, server respons with random value", function (done) {

        // Set up an interceptor
        nock('http://192.168.66.3:5000')
            .get('/status')
            .reply(200, { status: 'asdasd' });

        chai.request(app)
            .get('/camera')
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                chai.expect(res.text).to.be.equal('unknown');
                done();
            });

    });

    it("Get /camera, server respons with server error ", function (done) {

        // Set up an interceptor
        nock('http://192.168.66.3:5000')
            .get('/status')
            .reply(500);

        chai.request(app)
            .get('/camera')
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(500);
                done();
            });

    });
});



describe("Camera post routes", (done)=>{
    before(function () { server = sinon.fakeServer.create(); });
    after(function () { server.restore(); });

    it("Pst /camera on, server respons with on", function (done) {

        // Set up an interceptor
        nock('http://192.168.66.3:5000')
            .post('/camera')
            .reply(200, { status: 'on' });

        chai.request(app)
            .post('/camera')
            .send({value:"on"})
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                console.log(res.text);
                done();
            });

    });

    it("Post /camera off, server respons with off", function (done) {

        // Set up an interceptor
        nock('http://192.168.66.3:5000')
            .post('/camera')
            .reply(200, { status: 'off' });

        chai.request(app)
            .post('/camera')
            .send({value:"off"})
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(200);
                console.log(res.text);
                done();
            });

    });

    it("Post /camera off, server respons with error", function (done) {

        // Set up an interceptor
        nock('http://192.168.66.3:5000')
            .post('/camera')
            .reply(500);

        chai.request(app)
            .post('/camera')
            .send({value:"off"})
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(500);
                console.log(res.text);
                done();
            });

    });

    it("Post /camera invalid operation", function (done) {

  

        chai.request(app)
            .post('/camera')
            .send({value:"asdasd"})
            .end((err, res) => {
                chai.expect(res.status).to.be.equal(400);
                console.log(res.text);
                done();
            });

    });

});

