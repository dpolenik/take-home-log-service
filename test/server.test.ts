const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./server');

chai.use(chaiHttp);
chai.should();

describe('Server Integration Tests', () => {
  describe('GET /logs', () => {
    it('should return log entries with default line count', (done) => {
      chai.request(app)
        .get('/logs')
        .query({ filename: 'test-log.txt' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.results.should.be.an('array');
          res.body.lines.should.equal(100);
          res.body.count.should.equal(res.body.results.length);
          done();
        });
    });

    it('should filter logs by keyword', (done) => {
      chai.request(app)
        .get('/logs')
        .query({ filename: 'test-log.txt', keyword: 'Daisy' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.results.every((line) => line.includes('Daisy')).should.be
            .true;
          done();
        });
    });

    it('should handle custom line count', (done) => {
      chai.request(app)
        .get('/logs')
        .query({ filename: 'test-log.txt', lines: '5' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.results.should.have.lengthOf(5);
          done();
        });
    });

    it('should reject missing filename', (done) => {
      chai.request(app)
        .get('/logs')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.error.should.equal('filename is required');
          done();
        });
    });

    it('should reject invalid line count', (done) => {
      chai.request(app)
        .get('/logs')
        .query({ filename: 'test-log.txt', lines: '-5' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.error.should.equal('lines must be a positive number');
          done();
        });
    });

    it('should handle non-existing files', (done) => {
      chai.request(app)
        .get('/logs')
        .query({ filename: 'nonexistent.txt' })
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });

    it('should handle invalid directory traversal attempts', (done) => {
      chai.request(app)
        .get('/logs')
        .query({ filename: '../outside.txt' })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.error.should.include('Invalid file path');
          done();
        });
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', (done) => {
      chai.request(app)
        .get('/health')
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.include('healthy goat parade');
          done();
        });
    });
  });

  describe('404 handler', () => {
    it('should handle unknown routes', (done) => {
      chai.request(app)
        .get('/unknown')
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.equal('Not found');
          done();
        });
    });
  });
});
