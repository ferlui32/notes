require('dotenv').config()
const express = require("express");
const app = express();
const Note = require('./models/note')
const cors = require('cors')

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

let notes = []

  
  app.get("/", (req, res)=>{
    res.send('<h1>Hello World</h1>')
  })

  app.get('/api/notes', (req, res)=>{
    Note
    .find({})
    .then(notes=>{
      res.json(notes)
    })
    
  })

  app.get('/api/notes/:id', (req,res)=>{
    Note
    .findById(req.params.id)
    .then(note => {
      if (note){
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      console.log(err)
      res.status(400).send({error: 'malformatted id'})
    })
  })

  app.delete('/api/notes/:id', (req, res)=>{
    Note
    .findById(req.params.id)
    .then(note => {
      res.json(note)
    })
  })

const generateId = ()=>{
  const maxId = notes.length>0
  ?Math.max(...notes.map(n=>n.id))
  :0
  return maxId+1
}

  app.post("/api/notes", (req, res)=>{
    const body = req.body
    if (body.content === undefined){
      return res.status(400).json({
        error: "content missing",
      })
    }
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
      
    note.save()
    .then(savedNote =>{
      res.json(savedNote)
    })
  })

const PORT = process.env.PORT
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})
