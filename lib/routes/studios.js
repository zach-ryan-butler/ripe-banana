const { Router } = require('express');
const Studio = require('../models/studio');
const Film = require('../models/film');

module.exports = Router()
  .post('/', (req, res, next) => {

    const {
      name,
      address
    } = req.body;

    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio 
      .find()
      .select({ _id: true, name: true })
      .then(studio => res.send(studio))
      .catch(next);
  })
 
  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio.findById(req.params.id)
      .select({ __v: false }),
      Film.find({ studio: req.params.id })
      .select({ _id: true, title: true })
    ])
      .then(([studio, films]) => res.send({...studio.toJSON(), films}))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film.find({ studio: req.params.id })
    .then(film => {
      if(film.length >= 1) {
        res.send({message: 'cannot delete'});
      } else {
        Studio  
          .findByIdAndDelete(req.params.id)
          .then(studio => res.send(studio))
          .catch(next);
      }
    });
  });
