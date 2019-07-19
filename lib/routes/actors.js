const { Router } = require('express');
const Actor = require('../models/actor');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;

    Actor
      .create({ name, dob, pob })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor 
      .find()
      .select({ _id: true, name: true })
      .then(actor => res.send(actor))
      .catch(next);
  })
  // update with films
  .get('/:id', (req, res, next) => {
    Actor 
      .findById(req.params.id)
      .select({ _id: true, name: true })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body
    Actor
      .findByIdAndUpdate(req.params.id, { name, dob, pob }, { new: true})
      .then(updatedActor => res.send(updatedActor))
      .catch(next);
  });