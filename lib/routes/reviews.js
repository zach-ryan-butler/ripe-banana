const { Router } = require('express');
const Review = require('../models/review');

module.exports = Router()
  .post('/', (req, res, next) => {

    const {
      rating,
      reviewer,
      review,
      film
    } = req.body;

    Review
      .create({ rating, reviewer, review, film })
      .then(review => res.send(review))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Review
      .find()
      .populate('film', { _id: true, title: true })
      .select({ __v: false, createdAt: false, updatedAt: false, reviewer: false })
      .limit(100)
      .then(review => res.send(review))
      .catch(next);
  });