const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
console.log(`Connecting to ${url}...`)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name is Required!'],
  },
  number: {
    type: String,
    required: [true, 'Phone Number is Required!'],
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Phonebook = mongoose.model('Phonebook Record', phonebookSchema)

module.exports = Phonebook