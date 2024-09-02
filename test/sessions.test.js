import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Sessions Router', () => {
  it('should login a user', (done) => {
    const userCredentials = { username: 'rmendezstrobl@gmail.com', password: '1111' };
    chai.request(app)
      .post('/api/sessions/login')
      .send(userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should return error for invalid credentials', (done) => {
    const userCredentials = { username: 'wronguser', password: 'wrongpassword' };
    chai.request(app)
      .post('/api/sessions/login')
      .send(userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should logout a user', (done) => {
    chai.request(app)
      .post('/api/sessions/logout')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});