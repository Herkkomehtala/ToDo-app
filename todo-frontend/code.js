function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Loading To-do list from the server, please wait...'
    loadTodos()
}

async function loadTodos() {
    let response = await fetch('http://localhost:3000/todos')
    let todos = await response.json()
    showTodos(todos)
}

function createTodoListItem(todo) {
    let li = document.createElement('li')
    let li_attr = document.createAttribute('id')
      // Attach job's ID to the new attribute
    li_attr.value= todo._id
      // Attach attribute to the 'li' -element
    li.setAttributeNode(li_attr)
      // Create new text node that has the job's text
    let text = document.createTextNode(todo.text)
    li.appendChild(text)
      // Add the little x 
    let span = document.createElement('span')
    let span_attr = document.createAttribute('class')
      // Attach delete attribute, so we can add styles later
    span_attr.value = 'delete'
    span.setAttributeNode(span_attr)
      // Create text node with the value x
    let x = document.createTextNode(' x ')
      // Attach text node to our span element so it will be visible
    span.appendChild(x)
      // Add 'onclick' event so we can call removeTodo-funktion
    span.onclick = function() { removeTodo(todo._id) }
      // Create 'edit' element
    let edit = document.createElement('span')
    let edit_attr = document.createAttribute('class')
    edit_attr.value = 'edit'
    edit.setAttributeNode(edit_attr)
    let y = document.createTextNode(' Edit ')
    edit.appendChild(y)
    edit.onclick = function() { editTodo(todo._id) }
      // Finally add SPAN and Edit to our 'li' -element
    li.appendChild(span)
    li.appendChild(edit)

    return li
}

function showTodos(todos) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')
    // no todos
    if (todos.length === 0) {
      infoText.innerHTML = 'No jobs'
    } else {    
      todos.forEach(todo => {
          let li = createTodoListItem(todo)        
          todosList.appendChild(li)
      })
      infoText.innerHTML = ''
    }
}

async function addTodo() {
    let newTodo = document.getElementById('newTodo')
    const data = { 'text': newTodo.value }
    const response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    let todo = await response.json()
    let todosList = document.getElementById('todosList')
    let li = createTodoListItem(todo)
    todosList.appendChild(li)
  
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
}

async function removeTodo(id) {
    const response = await fetch('http://localhost:3000/todos/'+id, {
      method: 'DELETE'
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.parentNode.removeChild(li)
  
    let todosList = document.getElementById('todosList')
    if (!todosList.hasChildNodes()) {
      let infoText = document.getElementById('infoText')
      infoText.innerHTML = 'No jobs'
    }
}

async function editTodo(id) {
  actionbutton = document.getElementById('btn')
  actionbutton.innerText = 'Save'
  actionbutton.onclick = function() {saveTodo(id)}
  //Put in the text field 'li' -element's text
  let newTodo = document.getElementById('newTodo')
  let listelem = document.getElementById(id).childNodes[0].textContent
  newTodo.value = listelem
}

async function saveTodo(id) {
  //Save changes to MongoDB
  console.log("New saveTodo id: " + id)
  let newTodo = document.getElementById('newTodo')
  //Fetch button and change its attribute
  let btn = document.getElementById('btn')
  btn.innerText = 'Add'
  btn.setAttribute("onclick", "saveTodo()")
  //Perform update to MongoDB
  const data = { 'text': newTodo.value }
  const response = await fetch('http://localhost:3000/todos/'+id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  let todo = await response.json()
  console.log(todo)

  let infoText = document.getElementById('infoText')
  infoText.innerHTML = ''
  newTodo.value = ''
  //Delete old listings and get new ones
  ul = document.getElementById('todosList')
  ul.innerHTML = ''
  init()
}