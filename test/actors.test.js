require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/actor');

describe('actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'zach', dob: '11-14-2010', pob: 'Oregon' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'zach',
          dob: new Date('11-14-2010').toISOString(),
          pob: 'Oregon',
          __v: 0
        });
      });
  });
});