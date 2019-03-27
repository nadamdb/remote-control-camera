const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = null;
const path = require('path');

const directory = 'public/uploads';

chai.use(chaiHttp);
chai.should();

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
        db.run('INSERT INTO movements(date_time, path, image) VALUES(?, ?, ?)', ['2019-03-27_09-56-11', '/justanurl', 'test'], (err) => {
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
                chai.expect(movement).to.be.equal({timestamp:'2019-03-27_09-56-11', url:'/uploads/test', path:'/justanurl'})
                done();   
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