const { log } = require('console');
const http = require('https');
const query = require('querystring');

const userSearchParameters = [];
const searchIdx = -1;

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  response.writeHead(404, request.headers);
  response.write(JSON.stringify(responseJSON));
  response.end();
};

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
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
const buildXML = (data) => {
  console.log('Building Recipes');

  const u = 0;
  let content = '';

  data.results.forEach((recipe) => {
    const recipeElement = `<recipe><img id="thumb" src=${recipe.thumbnail}> </img>
    <a href="javascript:void(0)" recipe="${recipe.id}" onclick="loadRecipe(this)">${recipe.name}</a></recipe>`;
    content += recipeElement;
  });

  return content;
};
const getRecipeXML = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag } = params.query;
  let idx = 0;
  for (let i = 0; i < userSearchParameters.length; i += 1) {
    const recipeObj = userSearchParameters[i];
    if (recipeObj.food === food && recipeObj.tag === tag) {
      idx = i;
    }
  }

  // console.log(params);
  const content = buildXML(userSearchParameters[idx]);
  console.log(content);
  console.log(acceptedTypes);
  respond(request, response, 200, content, 'text/xml');
};

const postRecipesJSON = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag, click } = params.query;
  // console.log(acceptedTypes)
  if (food === undefined || tag === undefined) {
    // food="ok"
    // console.log(userSearchParameters);
    respond(request, response, 400, JSON.stringify(userSearchParameters), acceptedTypes);
  } else {
    console.log('POSTING');
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
          // console.log(json);
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

        let recipe;
        for (let i = 0; i < userSearchParameters.length; i += 1) {
          const recipeObj = userSearchParameters[i];
          if (recipeObj.food === food && recipeObj.tag === tag) {
            recipe = recipeObj;
          }
        }
        if (acceptedTypes.includes('text/xml')) {
          const content = buildXML(recipe);
          respondMeta(request, response, 201, content, 'text/xml');
        } else {
          // console.log(recipe)
          respondMeta(request, response, 201, JSON.stringify(recipe), 'application/json');
        }
      });
    });

    req.end();
  }
};

const getRecipesMeta = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag } = params.query;

  console.log(acceptedTypes);
  if (userSearchParameters.length === 0) {
    console.log('Failed Get');
    postRecipesJSON(request, response, params, acceptedTypes, httpMethod);
    // respond(request, response, userSearchParameters, 'application/json');
  } else {
    let recipe;
    for (let i = 0; i < userSearchParameters.length; i += 1) {
      const recipeObj = userSearchParameters[i];
      if (recipeObj.food === food && recipeObj.tag === tag) {
        recipe = recipeObj;
      }
    }
    if (acceptedTypes.includes('text/xml')) {
      const content = buildXML(recipe);
      respondMeta(request, response, 200, content, 'text/xml');
    } else {
      // console.log(recipe)
      respondMeta(request, response, 200, JSON.stringify(recipe), 'application/json');
    }
  }
};

const getRecipes = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag } = params.query;

  console.log(acceptedTypes);
  if (userSearchParameters.length === 0) {
    console.log('Failed Get');
    postRecipesJSON(request, response, params, acceptedTypes, httpMethod);
    // respond(request, response, userSearchParameters, 'application/json');
  } else {
    let recipe;
    for (let i = 0; i < userSearchParameters.length; i += 1) {
      const recipeObj = userSearchParameters[i];
      if (recipeObj.food === food && recipeObj.tag === tag) {
        recipe = recipeObj;
      }
    }
    if (recipe !== undefined) {
      if (acceptedTypes.includes('text/xml')) {
        const content = buildXML(recipe);
        respond(request, response, 200, content, 'text/xml');
      } else {
        // console.log(recipe)
        respond(request, response, 200, JSON.stringify(recipe), 'application/json');
      }
    } else {
      // console.log("No Recipes Found")
      // console.log(userSearchParameters)
      respond(request, response, 200, JSON.stringify(userSearchParameters), 'application/json');
      // notFound(request, response)
    }
  }
};

module.exports = {
  notFound,
  getRecipes,
  postRecipesJSON,
  getRecipesMeta,
};
