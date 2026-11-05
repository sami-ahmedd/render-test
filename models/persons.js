require('dotenv').config()
const dns = require('node:dns/promises')
dns.setServers(['1.1.1.1', '8.8.8.8'])
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to mongoDB')
  })
  .catch(error => {
    console.log('error connecting to mongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name : {
    type : String,
    minLength : 5
  },
  number : String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


const Person = mongoose.model('Person', personSchema)

module.exports= Person