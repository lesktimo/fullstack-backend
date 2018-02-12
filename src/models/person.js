const mongoose = require('mongoose')
const Salasana = require('../../.env')

const url = `mongodb://lesktimo:${Salasana.salaisuus()}@ds019986.mlab.com:19986/fullstack-backend`

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: Number
})

module.exports = Person