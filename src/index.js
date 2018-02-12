const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    let date = new Date()
    let i = 0
    Person
        .find({})
        .then(persons => {
            persons.forEach(person => {
                i++
                console.log(person)
            })
            res.send(`<p>puhelinluettelossa on ${i} henkilön tiedot</p>
                <p>${date}</p>`)
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(format))
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if(person){
                res.json(format(person))
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            res.status(404).send({ error: 'malformed id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const nameToBeAdded = body.name
    if(body.name === undefined || body.name === '') {
        return res.status(400).json({ error: 'name missing' })
    }
    if(body.number === undefined || body.number === '') {
        return res.status(400).json({ error: 'number missing' })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    Person
        .find({name: person.name})
        .then(foundPerson => {
            console.log('löydetty: ', foundPerson.name)
            if(foundPerson.name === nameToBeAdded) {
                console.log('nimi:', nameToBeAdded)
                return res.status(400).json({ error: 'name must be unique' })
            } else {
                person
                    .save()
                    .then(savedPerson => {
                        res.json(format(savedPerson))
                    })
            }
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformed id' })
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person
        .findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformed id' })
        })
})

const format = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})