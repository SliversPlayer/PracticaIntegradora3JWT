import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/app.src';

chai.use(chaiHttp);
const { expect } = chai;

describe('Products Router', () => {
  it('should get all products', (done) => {
    chai.request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new product', (done) => {
    const newProduct = { name: 'Test Product', price: 100 };
    chai.request(app)
      .post('/api/products')
      .send(newProduct)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', 'Test Product');
        done();
      });
  });

  it('should return error for invalid product ID', (done) => {
    chai.request(app)
      .get('/api/products/invalidID')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});