const mongoose = require('mongoose')

const userShema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]

})