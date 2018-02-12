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

let persons = []

Person
.find({})
.then(result => {
    result.forEach(person => {
        persons = persons.concat(person)
    })
    mongoose.connetion.close()
})

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    let date = new Date()
    res.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
              <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(body.name === undefined || body.name === ""){
        return res.status(400).json({error: 'name missing'})
    }
    if(body.number === undefined || body.number === ""){
        return res.status(400).json({error: 'number missing'})
    }
    for(p of persons){
        if(p.name === body.name){
            return res.status(400).json({error: 'name must be unique'})
        }
    }
    const newId = Math.floor((Math.random() * 1000000) + 1)
    const person = new Person({
        name: body.name,
        number: body.number,
        id: newId
    })
    person
        .save()
        .then(savedPerson => {
            res.json(formatPerson(savedPerson))
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const formatPerson = (person) => {
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