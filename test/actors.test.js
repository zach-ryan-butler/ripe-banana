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

  it('can get all actors', async() => {
    const actor = await Actor.create([
      { name: 'zach', dob: '11-14-2010', pob: 'Oregon' }
    ]);

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toEqual([
          { _id: expect.any(String), name: 'zach' }
        ]);
      });
  });

  it('can get an actor by id', async() => {
    const actor = await Actor.create({
      name: 'zach',
      dob: '11-14-2010',
      pob: 'Oregon'
    });

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'zach'
        });
      });
  });

  it('can update an actor by id', async() => {
    const actor = await Actor.create({
      name: 'zach',
      dob: '11-14-2010',
      pob: 'Oregon'
    });

    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({ name: 'bob', dob: '11-14-2010', pob: 'Oregon' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'bob',
          dob: new Date('11-14-2010').toISOString(),
          pob: 'Oregon',
          __v: 0
        });
      });
  });
});