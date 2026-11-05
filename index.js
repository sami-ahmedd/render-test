const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/persons')
require('dotenv').config()


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))

app.use(morgan('Method: :method\nPath:   :url\nBody:   :body\n', {
  skip: (req) => req.url === '/.well-known/appspecific/com.chrome.devtools.json'
}))




app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => {
      response.json(people)
    })
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person)
      }else{
        response.status(404).end()
      }
    })
    .catch(next)
})

app.get('/info', (request, response) => {
  const currentDate = new Date()
  Person.countDocuments({})
    .then(totalCount => {
      response.send(`phonebook has info for ${totalCount} people <br></br> ${currentDate.toString()}`)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})

app.post('/api/persons', (request, response, next) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  let person = new Person({
    name : request.body.name,
    number : request.body.number
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
  let { name, number } = request.body
  let id = request.params.id

  Person.findById(id)
    .then(person => {
      if (!person){
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      person.save()
        .then(updatedPerson => response.json(updatedPerson))
    })
    .catch(next)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError'){
    return response.status(400).json({ error :error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})