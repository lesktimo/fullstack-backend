const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const url = `mongodb://lesktimo:${process.env.MONGOPASS1}@ds019986.mlab.com:19986/fullstack-backend`

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: Number
})

module.exports = Person