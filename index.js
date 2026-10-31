const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    console.log(req.body);
  }
  return ''
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/api/persons', (request, response) =>{
    response.json(people)
})

app.get('/api/persons/:id', (request, response) =>{
    const person = people.find(person => person.id === request.params.id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
    
})

app.get('/info', (request, response) =>{
    const currentDate = new Date();
    response.send(`phonebook has info for ${people.length} people <br></br> ${currentDate.toString()}`)    
})

app.delete('/api/persons/:id', (request, response) =>{
    people = people.filter(person => person.id !== request.params.id)

    response.status(204).end()

})

app.post('/api/persons', (request,response)=>{
    const id = Math.floor(Math.random() * 10000).toString()

    if(!(request.body.name && request.body.number)){
        return response.status(400).json({
            error : 'name or number missing'
        })
    }

    let name = request.body.name
    if(people.find(person=> person.name.toLowerCase() === name.toLowerCase())){
        return response.status(400).json({
            error : "name must be unique"
        })
    }

    let person = {id,...request.body}
    people = people.concat(person)

    response.json(person)
    
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {
    console.log(`server running on port ${PORT}`);
})