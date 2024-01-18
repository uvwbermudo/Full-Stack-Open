require('dotenv').config
const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Provide a password.')
  process.exit(1)
} else if (process.argv.length === 4 || process.argv.length > 5) {
  console.log('To add a record use: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://uvwbfso:${password}@fullstackopen.tgjntbk.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const phonebookRecord = new mongoose.model('Phonebook Record', phonebookSchema)

if (process.argv.length === 3) {
  phonebookRecord.find({})
    .then(result => {
      console.log('Phonebook records: ')
      result.forEach(record => {
        console.log(record.name, record.number)
      })
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const newPhonebookRecord = new phonebookRecord({
    name:name,
    number: number,
  })

  newPhonebookRecord.save()
    .then(result => {
      console.log(`Added ${result.name} | number: ${result.number} to the phonebook.`)
      mongoose.connection.close()
    })

}


