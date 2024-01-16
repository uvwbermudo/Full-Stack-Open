const express = require('express')
const app = express()
const cors = require('cors')

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({error:'unknown endpoint'})
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))


app.get('/', (request,response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) =>{
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) =>{
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) =>{
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateID = () => {
  let newID = null
  let IDExists = true
  const noteIDs = notes.map(note => note.id)

  while (IDExists){
    newID = Math.floor(Math.random() * 10000) + 1
    IDExists = noteIDs.find(id => id === newID)
  }
  return newID
}

app.post('/api/notes', (request, response) =>{
  const body = request.body
  console.log(body)

  if (!body.content) {
    return response.status(400).json({
      error: 'Content Missing'
    })
  }
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateID() 
  }
  notes = notes.concat(note)
  response.json(note)
})


app.use(unknownEndpoint)

const PORT = process.env.port || 3001
app.listen(PORT, () =>{
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
})