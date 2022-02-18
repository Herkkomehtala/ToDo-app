const express = require('express') 
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

// mongo here...
const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://<YourMongoUserHere>:<PASSWORD HERE>@<YOUR CLUSTER HERE>'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database test connected")
})
// mongo scheema
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true } 
})
// mongo model
const Todo = mongoose.model('Todo', todoSchema, 'todos')

// todos-route POST
app.post('/todos', async (request, response) => {
    const { text } = request.body
    const todo = new Todo({
      text: text
    })
    const savedTodo = await todo.save()
    response.json(savedTodo)  
})
//todo-route delete
app.delete('/todos/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndRemove(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
})

app.get('/todos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
})

app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
})

//todos-route PUT
app.put('/todos/:id', async (request, response) => {
  console.log(request.body.text + " " + request.params.id)
  Todo.findByIdAndUpdate(request.params.id, request.body, {new:true}, function (err, todo){
    response.send(todo)
  })
})

// app listen port 3000
app.listen(port, () => {
  console.log('ToDo app listening on port 3000')
})
