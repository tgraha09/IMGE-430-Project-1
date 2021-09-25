const fs = require('fs');

const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const indexPage = fs.readFileSync(`${__dirname}/../client/client.html`);
const jokeClient = fs.readFileSync(`${__dirname}/../client/joke-client.html`);
const defaultCSS = fs.readFileSync(`${__dirname}/../client/default-styles.css`);

const recipeClient = fs.readFileSync(`${__dirname}/../client/recipe-client.html`);

const getDefaultCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(defaultCSS);
  response.end();
};

const getIndexResponse = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(indexPage);
  response.end();
};

const get404Response = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(errorPage);
  response.end();
};

const getRecipeClient = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(recipeClient);
  response.end();
};

const getJokeClient = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(jokeClient);
  response.end();
};

module.exports = {
  getIndexResponse,
  get404Response,
  getDefaultCSS,
  getJokeClient,
  getRecipeClient
};
