require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/actor');
const Studio = require('../lib/models/studio');
const Film = require('../lib/models/film');

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

    const studio = await Studio.create({
      name: 'Fox 2000 Pictures',
      address: {
        city: 'Los Angeles',
        state: 'California',
        country: 'United States'
      }
    });

    const film = await Film.create({
      title: 'Fight Club', 
      studio: studio._id, 
      released: '1999', 
      cast: [{ role: 'bill', actor: actor._id }]
      });

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'zach',
          dob: new Date('11-14-2010').toISOString(),
          pob: 'Oregon',
          films: [{
            _id: film._id.toString(),
            title: film.title,
            released: film.released
          }]
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

  it('can delete a actor by id if there are no films', async() => {
    const actor = await Actor.create({
      name: 'zach',
      dob: '11-14-2010',
      pob: 'Oregon'
    });

    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual(actorJSON);
      });
  });
});