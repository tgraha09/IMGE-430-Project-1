// npm i --save-dev eslint eslint-config-airbnb eslint-plugin-import
// https://github.com/tonethar/IGME-430-Fall-2021/blob/main/hw-notes/HW-random-jokes-plus.md#phase2
const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses');
const responseHandler = require('./responses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// 4 - here's our index page

// 5 - here's our 404 page

// 6 - this will return a random number no bigger than `max`, as a string
// we will also doing our query parameter validation here

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndexResponse,
    '/joke-client.html': htmlHandler.getJokeClient,
    '/random-joke': responseHandler.getRandomJokesJSON,
    '/random-jokes': responseHandler.getRandomJokesJSON,
    '/default-styles.css': htmlHandler.getDefaultCSS,
    '/recipe-client': htmlHandler.getRecipeClient,
    notFound: htmlHandler.get404Response,
  },
  HEAD: {
    '/random-joke': responseHandler.getRandomJokesMeta,
    '/random-jokes': responseHandler.getRandomJokesMeta,
    notFound: responseHandler.notFound,
  },
};
// https://github.com/tonethar/IGME-430-Fall-2021/blob/main/hw-notes/HW-random-jokes-plus.md#phase4
// 7 - this is the function that will be called every time a client request comes in
// this time we will look at the `pathname`, and send back the appropriate page
// note that in this course we'll be using arrow functions 100% of the time in our server-side code

const onRequest = (request, response) => {
  // console.log(request.headers);
  const path = request.url;// request.url
  const params = url.parse(path, true);
  const { pathname } = params;
  const acceptedTypes = request.headers.accept.split(',');
  // getTags()
  // console.log(path, pathname);
  // console.log(request.headers);
  const httpMethod = request.method;
  if (urlStruct[httpMethod][pathname]) {
    // console.log(params);
    urlStruct[httpMethod][pathname](request, response, params, acceptedTypes, httpMethod);
  } else {
    urlStruct[httpMethod].notFound(request, response);
  }
};

// 8 - create the server, hook up the request handling function, and start listening on `port`
http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
