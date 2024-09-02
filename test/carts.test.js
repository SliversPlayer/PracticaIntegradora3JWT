import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);
const { expect } = chai;

describe('Carts Router', () => {
  it('should create a new cart', (done) => {
    chai.request(app)
      .post('/api/carts')
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('should add a product to the cart', (done) => {
    const cartId = '66d0f0e998009df7d0250391';
    const productId = 'validProductId'
    chai.request(app)
      .post(`/api/carts/${cartId}/products`)
      .send({ productId, quantity: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('products');
        done();
      });
  });

  it('should return error for invalid cart ID', (done) => {
    chai.request(app)
      .get('/api/carts/invalidID')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});