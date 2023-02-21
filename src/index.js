const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
console.log(users)
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  if(!username){
    return response.status(400).json({ error: "Properties username is obrigatory" });
  }

  const user = users.find((user) => user.username === username);


  if(!user){
    return response.status(400).json({ error: "User not found" });
  }

  next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const id = v4();

  const userAlreadyExists = users.find((user) => 
    user.name === name && user.username === username
  );
  
  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists" });
  }

  if(!name || !username){
    return response.status(400).json({ error: "Properties name and username are obrigatory" });
  }

  const newUser = {
    id,
    name,
    username,
    todos: [],
  }

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const userTodos = users.filter(user => user.username === username)?.[0]?.todos
  console.log(userTodos)
  return response.status(201).json(userTodos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request.headers;
  const id = v4();

  if(!title || !deadline){
    return response.status(400).json({ error: "Properties title and deadline are obrigatory" });
  }

  const todoItem = {
    id,
    title,
    deadline,
    done: false,
    deadline,
    created_at: new Date(),
  }

  users[users.findIndex((user) => user.username === username)]?.todos.push(todoItem);

  return response.status(201).json(todoItem);
  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;