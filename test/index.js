const mongoose = require('mongoose');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const productSchema = require('../models/productSchema');
const app = require('../index');
const config = require('./config');
let token;
chai.use(chaiHttp);

// Global function to login user
function login() {
  return chai
    .request(app)
    .post('/api/user/login')
    .send({ email: config.email, password: config.password });
}

describe('check index Apis', () => {
  it('root api', () =>
    chai
      .request(app)
      .get('/')
      .then(res =>
        assert(res.status == 200, 'it should return 200 if correctly resolved')
      )
      .catch(function (err) {
        throw err;
      }));
  it('check for api version in use that it may depreceate in future', () =>
    chai
      .request(app)
      .get('/api')
      .then(res =>
        assert(res.status == 200, 'it should return 200 if this api is in use')
      )
      .catch(err => {
        throw err;
      }));
});

describe('user registration block', () => {
  // use before to clear the collection first so that every time duplicacy is avoided.
  before(() =>
    mongoose.connection.db
      .collection('users')
      .deleteMany({ email: config.email })
  );
  it('user registration', () =>
    chai
      .request(app)
      .post('/api/user/register')
      .send({
        name: config.name,
        email: config.email,
        password: config.password
      })
      .then(res =>
        assert(
          res.status == 201,
          'it should return 201 if user successfully registered'
        )
      )
      .catch(err => {
        throw err;
      }));
});

describe('for user login', async () => {
  //before is calling login function mentioned above
  before(async () => {
    let res = await login();
    token = res.body.token;
  });
  it('login test', () => assert.typeOf(token, 'string', 'user logged in '));
});

describe('products', () => {
  //clear all products before adding to avoid duplicate products
  before(() => productSchema.deleteMany());
  it('add products in database', () =>
    chai
      .request(app)
      .post('/api/product/add')
      .send({
        name: config.productName,
        description: config.productDescription,
        price: config.price,
        make: config.make
      })
      .then(res => {
        assert(res.status == 201, 'Product created');
        assert(res.body.name == config.productName, 'product name is ok');
        assert(
          res.body.description == config.productDescription,
          'product description is ok'
        );
        assert(res.body.price == config.price, 'product price is ok');
        assert(res.body.make == config.make, 'product make is ok');
      })
      .catch(err => {
        throw err;
      }));
  it('list all products in database', () =>
    chai
      .request(app)
      .get('/api/product')
      .then(res =>
        assert(
          res.status == 200 && Array.isArray(res.body),
          'confirm the data is in array format as all data is in a list'
        )
      )
      .catch(err => {
        throw err;
      }));
});

describe('cart, these tests are for logged in user', () => {
  it('add products to cart', () =>
    //Quering a product from database so that it can be added in the cart for testing
    //the pId is in a mongoose objectId form e.g : '5ed3d91247babb0db8bd97df'
    productSchema
      .findOne()
      .then(product =>
        chai
          .request(app)
          .post('/api/cart/add')
          .set('Authorization', `Bearer ${token}`) //passing token for authorization of user
          .send({ pId: product._id })
      )
      .then(res => {
        assert(res.status == 201, 'Product added to cart');
        assert(
          res.body.msg,
          'confirms that this product is added to cart only'
        );
      })
      .catch(err => {
        throw err;
      }));
  it('get cart items for specific user', () =>
    chai
      .request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`) //passing token for authorization of user
      .then(res => {
        assert(res.status == 200, 'confirms that this api is Ok');
        assert(
          Array.isArray(res.body),
          'confirms that result is in form of array'
        );
        assert(
          res.body.map(e => Object.keys(e).length == 5).indexOf(false) == -1,
          'each element is an object having keys _id, name, description, price and make mentioned in array above'
        );
      })
      .catch(err => {
        throw err;
      }));
});
