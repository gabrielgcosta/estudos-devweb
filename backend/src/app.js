const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4');

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const {title} = request.params;

  const results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs, likes} = request.body;

  const repository = {id: uuid(), title, url, techs, likes};
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositorieIndex = repositories.findIndex(repository => repository.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }
  
  const repository = {id, title, url, techs};
  repositories[repositorieIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositorieIndex = repositories.findIndex(repository => repository.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }

  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const {title, url, techs, likes} = request.body;

  const repositorieIndex = repositories.findIndex(repository => repository.id === id);

  if(repositorieIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }
  
  repositories[repositorieIndex].likes += 1;
  const repository = repositories[repositorieIndex];
  return response.json(repositories[repositorieIndex].likes);
});

module.exports = app;
