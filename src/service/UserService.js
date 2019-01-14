// Models
var UserModel = require('../models/users')
var express = require('express')
var router = express.Router()
var Auth = require('./AuthService')

Auth = new Auth()

// Date midleware logging
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

/* Auth middleware */
router.use('/user', Auth.VerifyAuth)

/* EndPoint for WindowFrame */
router.get('/user', (req, res) => {
  UserModel.find({}, function (error, response) {
    if (error) {
      res.send({
        error: 'We dont have any response from server',
        message: error
      })
    }
    if (response === null) {
      console.log('We dont find Req')
      res.send({
        error: 'We dont have any response from server'
      })
    }
    res.send(response)
  })
})

/**
 * Create user document
 */
router.post('/user', (req, res) => {
  console.log(req.body)
  var modelu = new UserModel(req.body)
  modelu.save(function (err) {
    if (err) {
      res.sendStatus(201).send(err)
    }
  })
  res.sendStatus(200)
})

/**
 * Delete all documents
 */
router.delete('/user', (req, res) => {
  UserModel.deleteMany({}, function (err, response) {
    if (err) {
      console.log(err)
    }
  })
  res.send(200, 'All documents was delete sucessfully.')
})

/**
 * Delete one user document based on id
 *
 */
router.delete('/user/:id', (req, res) => {
  UserModel.findOneAndDelete({
    id: req.params.id
  }, function (err, response) {
    if (err) {
      console.log('Error on Delete one: ', err)
      res.send({
        message: err
      })
    }
    if (response == null) {
      res.status(401).send({
        message: 'The User was not found. Unable to delete it',
      })
    }
    res.status(200).send({
      message: 'The User was delete sucessfully.',
    })
  })
})


/**
 * Update many user. Can be dangerous
 */
router.put('/user', (req, res) => {
  let apiRes = {}
  UserModel.updateMany({}, req.body, function (err, response) {
    if (err) {
      console.log('Error on UpdateMany: ', err)
      res.send({
        message: err
      })
    }
    res.send(200, response)
  })
})

/**
 * Update a single user
 */
router.put('/user/:id', (req, res) => {
  UserModel.findOneAndUpdate(req.params.id, req.body, function (err, response) {
    if (err) {
      console.log('Error on Update one: ', err)
      res.send({
        message: err
      })
    }
    if (response == null) {
      res.status(401).send({
        message: 'The User was not found. Unable to delete it',
      })
    }
    res.status(200).send({
      message: 'The User was update sucessfully.',
    })
  })
})

/**
 * CreateAuth token for given email.
 */
router.post('/createAuth/:email', (req, res) => {
  UserModel.findOne({
    email: req.params.email
  }, function (err, response) {
    if (err) {
      res.send(404, {
        "message": "An error has occurred",
        "error": err
      })
    }
    if (response) {
      let object_response = {
        email: response.email
      }
      Auth.CreateAuthToken(object_response).then(function (result) {
        if (typeof result != 'undefined') {
          res.send({
            token: result
          })
        }
      }, function (reject) {
        res.sendStatus(401).send(reject)
      })
    }
  })
})

module.exports = router