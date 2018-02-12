const mongoose = require('mongoose')
const Salasana = require('../../.env')

const url = `mongodb://lesktimo:${Salasana.salaisuus()}@ds019986.mlab.com:19986/fullstack-backend`

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: Number
})

if(process.argv[2] && process.argv[3]){
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    person
        .save()
        .then(result => {
            console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
            mongoose.connection.close()
        })
}else{
    console.log('puhelinluettelo:')
    Person
        .find({})
        .then(result => {
            result.forEach( person => {
                console.log(person.name, " ", person.number)
            })
            mongoose.connection.close()
        })
}