const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const server = require('../src/server');
const db = require('../src/db');
const CatsController = require('../src/controllers');
const validateCat = require('../src/middlewares');

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

const expect = chai.expect;
let request;

describe('Cats', () => {
  let catId;

  before(async () => {
    request = chai.request(server).keepOpen();
    await db.set('cats', []).write();
  });

  afterEach(() => sinon.restore());

  after(() => request.close());

  it('hit api base url', async () => {
    const response = await request.get('/api');

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('greet', 'Saluton Mundo!');
  });

  it('should get all cats', async () => {
    const response = await request.get('/api/cats');

    expect(response.body)
      .to.have.property('cats')
      .that.deep.equals([]);
  });

  it('should create a cat', async () => {
    const cat = {
      name: 'fluffy',
      age: 11
    };
    const response = await request.post('/api/cats').send(cat);
    catId = response.body.cat.id;
    expect(response.status).to.equal(201);
  });

  it('should get a cat by id', async () => {
    const response = await request.get(`/api/cats/${catId}`);

    expect(response.status).to.equal(200);
    expect(response.body.cat).to.have.property('id', catId);
  });

  // ADD CODE HERE
});
