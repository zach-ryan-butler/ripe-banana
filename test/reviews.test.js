require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/studio');
const Actor = require('../lib/models/actor');
const Film = require('../lib/models/film');
const Reviewer = require('../lib/models/reviewer');
const Review = require('../lib/models/review');

describe('review routes', () => {
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

  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'zach', dob: '11-03-1993', pob: 'Portland'})));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Fox Pictures', address: { city: 'Los Angeles', state: 'California', country: 'United States' }})));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Fight Club', studio: studio._id, released: '1999', cast: [{ role: 'bill', actor: actor._id }] })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'bob', company: 'bobs company' })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({
        rating: 4,
        reviewer: reviewer._id,
        review: 'a good movie',
        film: film._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 4,
          reviewer: reviewer._id,
          review: 'a good movie',
          film: film._id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        })
      });
  });

  it('can get at most a 100 reviews', async() => {
    const review = await Review.create([{
      rating: 4,
      reviewer: reviewer._id,
      review: 'a good movie',
      film: film._id
    }]);

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          rating: 4,
          review: 'a good movie',
          film: {
            _id: film._id,
            title: film.title
          }
        }]);
      });
  });
});
