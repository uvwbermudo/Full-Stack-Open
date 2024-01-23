const mongoose = require('mongoose')

if (process.argv.length < 3){
  console.log('Please provide a password')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://uvwbfso:${password}@fullstackopen.tgjntbk.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})

const Note = mongoose.model('Note',noteSchema)

// const note1 =  new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note1.save()
// .then(() => {
//   console.log('Note Saved!')
//   mongoose.connection.close()
// })

// const note2 =  new Note({
//   content: 'CSS is hard',
//   important: true
// })

// note2.save()
// .then(() => {
//   console.log('Note Saved!')
//   mongoose.connection.close()
// })



// Note.find({ important:false }).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })