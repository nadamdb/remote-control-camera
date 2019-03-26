const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./movements.db');
const path = require('path');

const directory = 'public/uploads';

chai.use(chaiHttp);
chai.should();

describe("Test upload", () => {
    describe("POST /upload", () => {
        // Test to get all students record
        it("test a route", (done) => {
             chai.request(app)
                 .post('/upload')
                 .attach('sampleFile','test/test.jpg','test.jpg')
                 .type('form')
                 .end((err, res) => {
                     res.should.have.status(200);
                    //ellenőrzés
                    done();
                        
                });
         });

         after(function(){
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
                        process.exit();
                    });
                    
                  });
             },1000);
             
            
         });
    });
});