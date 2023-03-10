const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

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

function checksExistsTodoById(request, response, next) {
  const { id } = request.params;
  const { username } = request.headers;

  if(!username){
    return response.status(400).json({ error: "Properties username is obrigatory" });
  }
  
  const existTodo = users[users.findIndex((user) => user.username === username)]
  ?.todos
  ?.some((todo) => todo.id === id);

  if(!existTodo){
    return response.status(404).json({ error: "Todo not found" });
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

app.put('/todos/:id', checksExistsUserAccount, checksExistsTodoById, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { username } = request.headers;

  if(!title || !deadline){
    return response.status(400).json({ error: "Properties title and deadline are obrigatory" });
  }

  users[users.findIndex((user) => user.username === username)]
  ?.todos
  ?.map((todo) => {
    if(todo.id === id){
      todo.title = title;
      todo.deadline = deadline;
      todoFormatted = todo;
    }
    return todo;
  });

  return response.status(201).json(todoFormatted);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsTodoById, (request, response) => {
  const { id } = request.params;
  const { username } = request.headers;
  
  users[users.findIndex((user) => user.username === username)]
  ?.todos
  ?.map((todo) => {
    if(todo.id === id){
      todo.done = true;
      todoFormatted = todo;
    }
    return todo;
  })
  
  return response.status(201).json(todoFormatted);
});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsTodoById, (request, response) => {
  const { id } = request.params;
  const { username } = request.headers;
  const currentUser = users[users.findIndex((user) => user.username === username)];

  const todosWithoutTodoWithId = currentUser
  ?.todos
  ?.filter((todo) => todo.id !== id);

  users[users.findIndex((user) => user.username === username)] = {
    ...currentUser,
    todos: todosWithoutTodoWithId
  };
  
  return response.status(204).json(todoFormatted);
});

module.exports = app;