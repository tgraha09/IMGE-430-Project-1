const { log } = require('console');
const http = require('https');
const query = require('querystring');

const userSearchParameters = [];
const searchIdx = -1;
const jokes = [

  {
    q: '@What did the dog say when he rubbed his tail on the sandpaper?', a: 'Ruff, Ruff!',
  },
  {
    q: "@Why don't sharks like to eat clowns?", a: 'Because they taste funny!',
  },
  {
    q: '@What did the boy cat say to the girl cat?', a: "You're Purr-fect!",
  },
  {
    q: "@What is a frog's favorite outdoor sport?", a: 'Fly Fishing!',
  },
  {
    q: '@I hate jokes about German sausages.', a: 'Theyre the wurst.',
  },
  {
    q: '@Did you hear about the cheese factory that exploded in France?', a: 'There was nothing left but de Brie.',
  },
  {
    q: '@Our wedding was so beautiful ', a: 'Even the cake was in tiers.',
  },
  {
    q: '@Is this pool safe for diving?', a: 'It deep ends.',
  },
  {
    q: '@Dad, can you put my shoes on?', a: 'I dont think theyll fit me.',
  },
  {
    q: '@What lies at the bottom of the ocean and twitches?', a: 'A nervous wreck.',
  },

];

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  response.writeHead(404, request.headers);
  response.write(JSON.stringify(responseJSON));
  response.end();
};

const respond = (request, response, content, type) => {
  response.writeHead(200, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getRandomJoke = (lim) => {
  let limit = lim;
  limit = Number(limit); // cast as number
  limit = !limit ? 1 : limit;
  limit = limit < 1 ? 1 : limit;
  limit = limit > jokes.length ? jokes.length : limit;
  const arr = [];
  for (let i = 0; i < limit; i += 1) {
    const number = Math.floor(Math.random() * jokes.length);
    const joke = jokes[number];
    arr.push(joke);
  }

  return JSON.stringify(arr);
};
const getXML = (joke) => {
  const { q } = joke;
  const { a } = joke;
  return `<joke>
  <q>${q}</q>
  <a>${a}</a>
  </joke>`;
};

const respondMeta = (request, response, status, content, type) => {
  const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');
  const headers = {
    'Content-Type': type,
    'Content-Length': getBinarySize(content),
    ...request.headers,
  };
  // no content to send, just headers!
  response.writeHead(status, headers);
  response.end();
};

const getJokesXML = (randomJokes) => {
  let jokeXML = '<joke>';
  const jokeParse = JSON.parse(randomJokes);
  jokeParse.forEach((joke) => {
    const xml = getXML(joke);
    jokeXML += xml;
  });
  jokeXML += '</joke>';
  return jokeXML;
};

const getRandomJokesMeta = (request, response, params, acceptedTypes, httpMethod) => {
  const { limit } = params.query;
  const randomJokes = getRandomJoke(limit);
  if (acceptedTypes.includes('text/xml')) {
    const xmlContent = getJokesXML(randomJokes);
    respondMeta(request, response, 200, xmlContent, 'text/xml');
  } else {
    respondMeta(request, response, 200, randomJokes, 'application/json');
  }
};

const getRandomJokesJSON = (request, response, params, acceptedTypes, httpMethod) => {
  const { limit } = params.query;
  // console.log(params);
  const randomJokes = getRandomJoke(limit);
  if (acceptedTypes.includes('text/xml')) {
    const xmlContent = getJokesXML(randomJokes);
    respond(request, response, xmlContent, 'text/xml');
  } else {
    respond(request, response, randomJokes, 'application/json');
  }
};

const postRecipesJSON = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag, click } = params.query;
  if (click !== undefined) {
    console.log('POSTING');
    if (food === undefined || tag === undefined) {
      // food="ok"
      console.log(userSearchParameters);
      respond(request, response, JSON.stringify(userSearchParameters), 'application/json');
    } else {
      const options = {
        method: 'GET',
        hostname: 'tasty.p.rapidapi.com',
        port: null,
        path: `/recipes/list?from=0&size=20&tags=${tag}&q=${food}`,
        headers: {
          'x-rapidapi-host': 'tasty.p.rapidapi.com',
          'x-rapidapi-key': '170e038a70mshc48a677384b7b29p120f51jsn123cfd31d18c',
          useQueryString: true,
        },
      };

      const req = http.request(options, (res) => {
        const chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = JSON.parse(Buffer.concat(chunks).toString());
          const results = [];
          // console.log(body); 
          body.results.forEach((json) => {
            //console.log(json);
            const recipeObj = {
              name: json.name,
              id: json.id,
              searchIndex: json.position,
              
              thumbnail: json.thumbnail_url,
              
            };
            /**/
            results.push(recipeObj);
          });
          // console.log(arr);
          // console.log(body);
          userSearchParameters.push({
            searchedAt: new Date(),
            food,
            tag,
            results,
          });

          let idx = 0;
          for (let i = 0; i < userSearchParameters.length; i += 1) {
            const recipeObj = userSearchParameters[i];
            if (recipeObj.food === food && recipeObj.tag === tag) {
              idx = i;
            }
          }
          // console.log(userSearchParameters[idx]);
          respond(request, response, JSON.stringify(userSearchParameters), 'application/json');
        });
      });

      req.end();
    }
  } else {
    console.log(userSearchParameters);
    respond(request, response, JSON.stringify(userSearchParameters), 'application/json');
  }
  // console.log(click);
};

const getRecipesJSON = (request, response, params, acceptedTypes, httpMethod) => {
  console.log('Get Recipe');
  // console.log(userSearchParameters);
  if (userSearchParameters.length === 0) {
    postRecipesJSON(request, response, params, acceptedTypes, httpMethod);
  } else {
    respond(request, response, JSON.stringify(userSearchParameters), 'application/json');
  }
};

module.exports = {
  getRandomJokesJSON,
  getRandomJokesMeta,
  notFound,
  getRecipesJSON,
  postRecipesJSON,

};
