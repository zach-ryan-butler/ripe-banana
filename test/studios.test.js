require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/studio');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ name: 'Fox 2000 Pictures', address: { city: 'Los Angeles', state: 'California', country: 'United States' } })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Fox 2000 Pictures',
          address: {
            city: 'Los Angeles',
            state: 'California',
            country: 'United States'
          },
          __v: 0
        });
      });
  });

  it('can get all studios', async() => {
    const studios = await Studio.create([
      { name: 'Fox 2000 Pictures', address: { city: 'Los Angeles', state: 'California', country: 'United States' } },
    ]);

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          name: 'Fox 2000 Pictures'
        }]);
      });
  });

  it('can get a studio by id', async() => {
    const studio = await Studio.create({
      name: 'Fox 2000 Pictures',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
    });

    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        const studioJSON = JSON.parse(JSON.stringify(studio));
        expect(res.body).toEqual(studioJSON);
      });
  });
});
