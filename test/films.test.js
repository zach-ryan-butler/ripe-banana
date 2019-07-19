require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require ('../lib/models/actor');
const Studio = require('../lib/models/studio');

describe('film routes', () => {
  beforeAll(() => {
    connect();
  });
  
  // beforeEach(async() => {
  //   const actor = await JSON.parse(JSON.stringify(Actor.create({ name: 'zach', dob: '11-03-1993', pob: 'Portland'})));
  //   const studio = await JSON.parse(JSON.stringify(Studio.create({ name: 'Fox 2000 Pictures', address: { city: 'Los Angeles', state: 'California', country: 'United States' }})));
  // });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a film', async() => {
    const actor = await JSON.parse(JSON.stringify(Actor.create({ name: 'zach', dob: '11-03-1993', pob: 'Portland'})));
    const studio = await JSON.parse(JSON.stringify(Studio.create({ name: 'Fox 2000 Pictures', address: { city: 'Los Angeles', state: 'California', country: 'United States' }})));

    return request(app)
      .post('/api/v1/films')
      .send({ title: 'Fight Club', studio: studio._id, released: '1999', cast: [{ role: 'lead', actor: actor._id }] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Fight Club',
          studio: studio._id,
          released: '1999',
          cast: [{
            role: 'lead',
            actor: actor._id
          }],
          __v: 0
        });
      }); 
  });
});