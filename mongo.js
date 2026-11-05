const dns = require('node:dns/promises')
dns.setServers(['1.1.1.1', '8.8.8.8'])

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sami13:${password}@cluster0.zjq2yyw.mongodb.net/phonebookApp`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

Person.find({})
  .then((people) => {
    people.forEach((person) => {
      console.log(person)
    })
    mongoose.connection.close()
  })

