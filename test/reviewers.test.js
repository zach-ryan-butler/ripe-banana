require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/reviewer');
const Studio = require('../lib/models/studio');
const Actor = require('../lib/models/actor');
const Film = require('../lib/models/film');
const Review = require('../lib/models/review');

describe('reviewer routes', () => {
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

  it('creates a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'bill', company: 'Bills Reviews' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'bill',
          company: 'Bills Reviews',
          __v: 0
        });
      });
  });

  it('can get reviewers', async() => {

    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          name: 'bob',
          company: 'bobs company'
        }]);
      });
  });

  it('can get reviewers by id', async() => {

    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'bob',
          company: 'bobs company',
          reviews: [{
            _id: review._id,
            rating: review.rating,
            review: review.review,
            film: {
              _id: film._id,
              title: film.title
            }
          }]
        });
      });
  });
});