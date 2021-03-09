// BUILD YOUR SERVER HERE
const express = require('express')

const Model = require('./users/model')


const server = express()


server.use(express.json())

// [POST] /api/dogs (C of CRUD, create new dog from JSON payload)
server.post('/api/users', (req, res) => {
    // pull any info you need from req
    const newModel = req.body
  
    if (!newModel.name || !newModel.bio) { // validate req things if needed
      // send an appropriate response
      res.status(400).json({ message: 'Please provide name and bio for the user' })
    } else {
        Model.create(newModel)
        .then(model => {
          // throw new Error('AAAAAAAHHHHH!!!!')
          // send an appropriate response
          res.status(201).json(model)
        })
        .catch(() => {
          // send an appropriate response
          res.status(500).json({ message: "There was an error while saving the user to the database" })
        })
    }
  })


// [GET] /api/users
server.get('/api/users', (req, res) => {
    Model.find()
      .then(model => {
        console.log(model)
        res.status(200).json(model)
      })
      .catch(()  => {
        res.status(500).json({ message: "The users information could not be retrieved"  })
      })
  })


// [GET] /api/users/:id (R of CRUD, fetch dog by :id)
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    Model.findById(id)
      .then(model => {
        console.log('we are getting -->', model) // testing
        if (!model) {
          res.status(404).json({ message: `The user with the specified ID ${id} does not exist` })
        } else {
          res.json(model)
        }
      })
      .catch(()  => {
        res.status(500).json({ message: "The user information could not be retrieved"  })
      })
  })

// [DELETE] /api/users/:id (D of CRUD, remove dog with :id)
server.delete('/api/users/:id', async (req, res) => {
    try {
      const deleted = await Model.delete(req.params.id)
      if (!deleted) {
        res.status(404).json({ message:  "The user with the specified ID does not exist"  })
      } else {
        res.json(deleted)
      }
    } catch(err) {
      res.status(500).json({ message: "The user could not be removed" })
    }
  })

// [PUT] /api/users/:id (U of CRUD, update dog with :id using JSON payload)
server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params
    const changes = req.body
  
    try {
      if (!changes.name || !changes.bio) { // validate req things if needed
        res.status(422).json({ message: 'name and weight are required!' })
      } else {
        const updatedModel = await Model.update(id, changes)
        if (!updatedModel) {
          res.status(404).json({ message: "The user with the specified ID does not exist" })
        } else {
          res.status(200).json(updatedModel)
        }
      }
    } catch (err) {
      res.status(500).json({ message: "The user information could not be modified"  })
    }
  })








module.exports = server; // EXPORT YOUR SERVER instead of {}
