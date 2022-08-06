const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please enter email']
  },
  password: {
    type: String,
    required: [true, 'Please enter password']
  },
  friends: {
    type: Array,
    default: []
  }
},
{
  timestamps: true
})


module.exports = mongoose.model('User', userSchema)