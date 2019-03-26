const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

describe("Test upload", () => {
    describe("POST /upload", () => {
        // Test to get all students record
        it("test a route", (done) => {
             chai.request(app)
                 .post('/')
                 .send({})
                 .end((err, res) => {
                     res.should.have.status(200);
                     //res.body.should.be.a('object');
                     done();
                  });
         });
    });
});