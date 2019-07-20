require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require ('../lib/models/actor');
const Studio = require('../lib/models/studio');
const Film = require('../lib/models/film');
const Reviewer = require('../lib/models/reviewer');
const Review = require('../lib/models/review');

describe('film routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let actor = null;
  let film = null;
  let reviewer = null;
  let review = null;

  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'zach', dob: '11-03-1993', pob: 'Portland'})));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Fox Pictures', address: { city: 'Los Angeles', state: 'California', country: 'United States' }})));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Fight Club', studio: studio._id, released: '1999', cast: [{ role: 'bill', actor: actor._id }] })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'bob', company: 'bobs company' })));
    review = JSON.parse(JSON.stringify(await Review.create({ rating: 4, review: 'a good movie', reviewer: reviewer._id, film: film._id })));
  });
  
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'Fight Club', studio: studio._id, released: '1999', cast: [{ role: 'bill', actor: actor._id }] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Fight Club',
          studio: studio._id,
          released: 1999,
          cast: [{
            _id: expect.any(String),
            role: 'bill',
            actor: actor._id
          }],
          __v: 0
        });
      }); 
  });

  it('can get films', async() => {

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          title: 'Fight Club',
          released: 1999,
          studio: {
            _id: studio._id,
            name: studio.name
          }
        }]);
      });
  });

  it('can delete a film by id', async() => {
    const film = await Film.create({
      title: 'Fight Club', 
      studio: studio._id, 
      released: '1999', 
      cast: [{ role: 'bill', actor: actor._id }]
      });

    return request(app)
    .delete(`/api/v1/films/${film._id}`)
    .then(res => {
      const filmJSON = JSON.parse(JSON.stringify(film));
      expect(res.body).toEqual(filmJSON);
    });
  });

  it('can get a film by id', () => {
    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          title: film.title,
          released: film.released,
          studio: {
            _id: studio._id,
            name: studio.name
          },
          cast: [{
            _id: expect.any(String),
            role: film.cast[0].role,
            actor: {
              _id: actor._id,
              name: actor.name
            }
          }],
          reviews: [{
            _id: review._id,
            rating: review.rating,
            review: review.review,
            reviewer: {
              _id: reviewer._id,
              name: reviewer.name
            }
          }]
        })
      });
  });
});