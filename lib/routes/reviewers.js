const { Router } = require('express');
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');

module.exports = Router()
  .post('/', (req, res, next) => {

    const {
      name,
      company
    } = req.body;

    Reviewer
      .create({ name, company })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .select({ __v: false })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Reviewer  
        .findById(req.params.id)
        .select({ __v: false }),
      Review
        .find({ reviewer: req.params.id })
        .populate('film', { _id: true, title: true })
        .select({ _id: true, rating: true, review: true })
    ])
    .then(([reviewer, reviews ]) => res.send({...reviewer.toJSON(), reviews }))
    .catch(next);
  });