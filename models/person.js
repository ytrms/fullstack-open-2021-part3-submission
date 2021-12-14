const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to DB...')
mongoose.connect(url)
  .then(result => {
    console.log('Connected to DB.')
  })
  .catch(error => {
    console.log('Failed to connect to DB. Error: ' + error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)