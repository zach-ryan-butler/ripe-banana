const { Router } = require('express');
const Film = require('../models/film');
const Review = require('../models/review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      title,
      studio,
      released,
      cast
    } = req.body
    
    Film  
      .create({ title, studio, released, cast })
      .then(film => res.send(film))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film  
      .find()
      .populate('studio', { _id: true, name: true })
      .select({ _id: true, title: true, released: true })
      .then(film => res.send(film))
      .catch(next)
  })

  .delete('/:id', (req, res, next) => {
    Film
      .findByIdAndDelete(req.params.id)
      .then(film => res.send(film))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Film
        .findById(req.params.id)
        .populate('studio', { _id: true, name: true })
        .populate('cast.actor', { _id: true, name: true })
        .select({ __v: false, _id: false }),
      Review 
        .find({ film: req.params.id })
        .populate('reviewer', { _id: true, name: true })
        .select({ __v: false, createdAt: false, updatedAt: false, film: false })
    ])
    .then(([film, reviews]) => res.send({...film.toJSON(), reviews}))
    .catch(next);
  });

