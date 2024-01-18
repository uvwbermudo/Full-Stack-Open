require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook')
const PORT = process.env.PORT

app.use(express.json())
morgan.token('data', (request, response) => {return JSON.stringify(request.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('dist'))

function getTimezoneOffset() {
  function z(n){return (n<10? '0' : '') + n}
  var offset = new Date().getTimezoneOffset();
  var sign = offset < 0? '+' : '-';
  offset = Math.abs(offset);
  return sign + z(offset/60 | 0) + z(offset%60);
}

app.get('/', (request,response, next) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Phonebook.find({})
    .then(records => response.json(records))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request,response, next) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      } else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request,response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
})

app.post('/api/persons', (request,response, next) => {
  const body = request.body

  const person = new Phonebook({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))

})

app.get('/info', (request,response, next) => {
  const currentDate = new Date()
  const currentTime = currentDate.toLocaleString([], {hour12:false}).split(',')[1]
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const gmtOffset = getTimezoneOffset()
  response.send(`
    <div>Phonebook has info for ${persons.length} people</div>
    <br/>
    <div>${currentDate.toDateString()} ${currentTime} GMT ${gmtOffset} (${browserTimezone}) </div>
  `)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number,
    name: body.name
  }

  Phonebook.findByIdAndUpdate(request.params.id, person, {new:true, runValidators:true, content:'query'})
    .then(updatedNote => response.json(updatedNote))
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({error:'unknown endpoint'})
}


app.use(unknownEndpoint)
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
