const { Router } = require('express');
const Studio = require('../models/studio');

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
  //come back and update when films is done
  .get('/:id', (req, res, next) => {
    Studio  
      .findById(req.params.id)
      .then(studio => res.send(studio))
      .catch(next);
  });
