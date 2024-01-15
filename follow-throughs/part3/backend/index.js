const express = require('express')
const app = express()

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


app.use(express.json())
app.use(requestLogger)


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
  const maxID = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  : 0 

  return maxID + 1
}

app.post('/api/notes', (request, response) =>{
  const body = request.body

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

const PORT = 3001
app.listen(PORT, () =>{
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
})