const { log } = require('console');
const http = require('https');
const query = require('querystring');

const userSearchParameters = [];
const userRecipes = [];
const searchIdx = -1;
const temp = {
  name: 'Roasted Chicken With Apples ',
  food: 'Chicken',
  tag: 'american',
  id: '7803',
  thumbnail: '"https://img.buzzfeed.com/tasty-app-user-assets-prod-us-east-1/recipes/a7fdcc4cf4084d19984cba3e771bad61.jpeg"',
};
const defaultRecipe = {
  searchedAt: '2021-10-09T16:13:35.283Z',
  food: 'Chicken',
  tag: 'american',
  results: [
    {
      name: 'Roasted Chicken With Apples & Fennel',
      id: 7803,
      thumbnail: 'https://img.buzzfeed.com/tasty-app-user-assets-prod-us-east-1/recipes/a7fdcc4cf4084d19984cba3e771bad61.jpeg',
    },
    {
      name: 'Buffalo Chicken Potato Skin Nachos',
      id: 7790,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/342089.jpg',
    },
    {
      name: 'Grilled Donuts 2 Ways',
      id: 7686,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/335396.jpg',
    },
    {
      name: 'Crispy Air Fryer Chicken Thighs',
      id: 7652,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/321577.jpg',
    },
    {
      name: 'The Crispiest Fried Chicken',
      id: 7643,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/326957.jpg',
    },
    {
      name: 'Instant Pot Pulled Pork',
      id: 7619,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/331812.jpg',
    },
    {
      name: 'Instant Pot Pulled Chicken',
      id: 7618,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/331807.jpg',
    },
    {
      name: 'Instant Pot Beef Chili',
      id: 7612,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/331365.jpg',
    },
    {
      name: 'Skillet Chicken Breasts',
      id: 7611,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/331363.jpg',
    },
    {
      name: 'Crispy Chicken Thighs',
      id: 7609,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/331357.jpg',
    },
    {
      name: 'Wild Rice Casserole',
      id: 7605,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/331255.jpg',
    },
    {
      name: 'Chicken Cutlets',
      id: 7603,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/331251.jpg',
    },
    {
      name: 'Air Fryer Fried Chicken',
      id: 7586,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/330875.jpg',
    },
    {
      name: 'Air Fryer Popcorn Chicken',
      id: 7584,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/330869.jpg',
    },
    {
      name: '6-Hour Lasagna',
      id: 7530,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/64f81af5a93f4400987fe009daf9a2d5/BFV78902_TimeToCookLasagna_SE_060121_V5_YT.jpg',
    },
    {
      name: 'French Onion Chicken',
      id: 7424,
      thumbnail: 'https://img.buzzfeed.com/tasty-app-user-assets-prod-us-east-1/recipes/54a6645b611e4c979c5d701df8412b77.png',
    },
    {
      name: 'Bloody Mary Burger',
      id: 7533,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/326676.jpg',
    },
    {
      name: 'Shortcut Pumpkin Soup',
      id: 7398,
      thumbnail: 'https://img.buzzfeed.com/tasty-app-user-assets-prod-us-east-1/recipes/985bbac510e64d2090ffc3f6526f135b.png',
    },
    {
      name: 'Instant Pot Peach Habanero Ribs',
      id: 7367,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/322266.jpg',
    },
    {
      name: 'Instant Pot Chicken Noodle Soup',
      id: 7361,
      thumbnail: 'https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/322003.jpg',
    },
  ],
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  response.writeHead(404, request.headers);
  response.write(JSON.stringify(responseJSON));
  response.end();
};

const notCorrect = (request, response, types) => {
  const responseJSON = {
    message: 'The endpoint was reachable, but the resource was inaccessible. Search parameters may be incorrect or missing',
    id: 'notCorrect',
  };
  if (types.includes('text/xml')) {
    response.writeHead(400, request.headers);
    response.write(`<error errorid="${responseJSON.id}">${responseJSON.message}</error>`);
    response.end();
  } else {
    response.writeHead(400, request.headers);
    response.write(JSON.stringify(responseJSON));
    response.end();
  }
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
  // console.log('Building Recipes');
  /// /console.log(data)
  const u = 0;
  let content = '<Recipes>';
  if (data.results !== undefined) {
    data.results.forEach((recipe) => {
      const recipeElement = `<Recipe name="${recipe.name}" recipeID="${recipe.id}" thumbnail="${recipe.thumbnail}"> </Recipe>`;

      content += recipeElement;
    });
  } else {
    data.forEach((search) => {
      const processXML = () => {
        let displayString = '';
        search?.results?.forEach((recipe) => {
          const recipeElement = `<Recipe name="${recipe.name}" recipeID="${recipe.id}" thumbnail="${recipe.thumbnail}"> </Recipe>`;

          displayString += recipeElement;
        });
        return displayString;
      };
      let searchedAt;
      if (search.searchedAt === null || search.searchedAt === undefined) {
        searchedAt = '';
      } else {
        searchedAt = `timeSearched="${search?.searchedAt}"`;
      }
      const recipeElement = `<SearchItem ${searchedAt} name="${search?.name}"  food="${search.food}" tag="${search.tag}" id="${search.id}"> 
          ${processXML()}
      </SearchItem>`;

      content += recipeElement;
    });
  }

  content += '</Recipes>';
  /// /console.log(content)
  return content;
};
const getRecipeObj = (list, data) => {
  let recipe;
  for (let i = 0; i < list.length; i += 1) {
    const recipeObj = list[i];
    if (recipeObj?.id === data.id) {
      recipe = recipeObj;
    }
  }
  return recipe;
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

  // //console.log(params);
  const content = buildXML(userSearchParameters[idx]);
  // console.log(content);
  // console.log(acceptedTypes);
  respond(request, response, 200, content, 'text/xml');
};

const postRecipesJSON = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag } = params.query;
  // //console.log(acceptedTypes)
  if (food === undefined || tag === undefined) {
    if (userSearchParameters.length === 0) {
      userSearchParameters.push(defaultRecipe);
      // userSearchParameters.push(defaultRecipe)
    }
    // respond(request, response, 400, JSON.stringify(userSearchParameters), acceptedTypes);

    if (acceptedTypes.includes('text/xml')) {
      const content = buildXML(userSearchParameters);
      respond(request, response, 201, content, 'text/xml');
    } else {
      // //console.log(recipe)
      respond(request, response, 201, JSON.stringify(userSearchParameters), 'application/json');
    }
  } else {
    // console.log('POSTING');
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
        // //console.log(body);
        body.results.forEach((json) => {
          // //console.log(json);
          const recipeObj = {
            name: json.name,
            id: json.id,
            searchIndex: json.position,
            thumbnail: json.thumbnail_url,

          };
          /**/
          results.push(recipeObj);
        });
        // //console.log(arr);
        // //console.log(body);
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
        /// /console.log(recipe)
        if (acceptedTypes.includes('text/xml')) {
          const content = buildXML(recipe);
          respond(request, response, 201, content, 'text/xml');
        } else {
          // //console.log(recipe)
          respond(request, response, 201, JSON.stringify(recipe), 'application/json');
        }
      });
    });

    req.end();
  }
};

const postRecipePlaylist = (request, response, params, acceptedTypes, httpMethod) => {
  const {
    food, tag, id, name, thumbnail,
  } = params.query;
  // console.log(food, tag, id, name,)
  /// /console.log(food, tag, id, name)
  if (food === null || food === undefined || tag === null || tag === undefined
    || id === null || id === undefined) {
    // console.log("Missing Attr")
    if (userRecipes.length === 0) {
      userRecipes.push(temp);
    }
    respond(request, response, 400, JSON.stringify(userRecipes), acceptedTypes);
  } else {
    // console.log('POSTING TO PLAYLIST');
    userRecipes.push({
      name,
      food,
      tag,
      id,
      thumbnail,
    });
    const recipe = getRecipeObj(userRecipes, { id });
    if (recipe !== undefined) {
      if (acceptedTypes.includes('text/xml')) {
        const content = buildXML(recipe);
        respond(request, response, 201, content, 'text/xml');
      } else {
        // //console.log(recipe)
        respond(request, response, 201, JSON.stringify(recipe), 'application/json');
      }
    } else {
      // console.log("Correct query search, incorrect search terms")
      notCorrect(request, response, acceptedTypes);
    }
  }
};

const changeRecipeName = (request, response, params, acceptedTypes, httpMethod) => {
  const { id, name } = params.query;

  /// /console.log(food, tag, id, name)
  if (id === undefined || name === undefined) {
    notCorrect(request, response, acceptedTypes);
  } else {
    // console.log('Updating');
    const recipe = getRecipeObj(userRecipes, { id });

    if (recipe !== undefined) {
      // console.log("normal POST find")
      recipe.name = name;
      if (acceptedTypes.includes('text/xml')) {
        const content = buildXML(recipe);
        respond(request, response, 204, content, 'text/xml');
      } else {
        // //console.log(recipe)
        respond(request, response, 204, JSON.stringify(recipe), 'application/json');
      }
    } else {
      // console.log("Correct query search, incorrect search terms")
      notCorrect(request, response, acceptedTypes);
    }
  }
};

const deleteRecipe = (request, response, params, acceptedTypes, httpMethod) => {
  const { id, name } = params.query;

  /// /console.log(food, tag, id, name)
  if (id === undefined || name === undefined) {
    notCorrect(request, response, acceptedTypes);
  } else {
    for (let i = 0; i < userRecipes.length; i += 1) {
      const recipeObj = userRecipes[i];

      if (recipeObj?.id === id) {
        delete userRecipes[i];
      }
    }
  }
};

const getRecipesMeta = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag } = params.query;
  if (food === undefined || tag === undefined) {
    // console.log("No search querys found")
    /* No search querys found */
    if (userSearchParameters.length === 0) {
      userSearchParameters.push(defaultRecipe);
      // userSearchParameters.push(defaultRecipe)
    }
    /// /console.log(userSearchParameters)
    if (acceptedTypes.includes('text/xml')) {
      const content = buildXML(userSearchParameters);
      respondMeta(request, response, 200, content, 'text/xml');
    } else {
      /// /console.log(recipe)
      // const content = buildXML(userSearchParameters);
      respondMeta(request, response, 200, JSON.stringify(userSearchParameters), 'application/json');
    }
  } else {
    let recipe;
    for (let i = 0; i < userSearchParameters.length; i += 1) {
      const recipeObj = userSearchParameters[i];
      if (recipeObj.food === food && recipeObj.tag === tag) {
        recipe = recipeObj;
      }
    }
    if (recipe !== undefined) {
      // console.log("normal GET from querys")
      /* normal GET from querys */
      if (acceptedTypes.includes('text/xml')) {
        const content = buildXML(recipe);
        respondMeta(request, response, 200, content, 'text/xml');
      } else {
        // //console.log(recipe)
        respondMeta(request, response, 200, JSON.stringify(recipe), 'application/json');
      }
    } else {
      // console.log("Correct query search, incorrect search terms")
      notCorrect(request, response, acceptedTypes);
    }
  }
};

const getPlaylistMeta = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag } = params.query;
  if (food === undefined || tag === undefined) {
    // console.log("No search querys found")
    /* No search querys found */
    if (userRecipes.length === 0) {
      userRecipes.push(temp);
      // userSearchParameters.push(defaultRecipe)
    }
    /// /console.log(userSearchParameters)
    if (acceptedTypes.includes('text/xml')) {
      const content = buildXML(userRecipes);

      respondMeta(request, response, 200, content, 'text/xml');
    } else {
      /// /console.log(recipe)
      // const content = buildXML(userSearchParameters);
      respondMeta(request, response, 200, JSON.stringify(userRecipes), 'application/json');
    }
  } else {
    let recipe;
    for (let i = 0; i < userRecipes.length; i += 1) {
      const recipeObj = userRecipes[i];
      if (recipeObj.food === food && recipeObj.tag === tag) {
        recipe = recipeObj;
      }
    }
    if (recipe !== undefined) {
      // console.log("normal GET from querys")
      /* normal GET from querys */
      if (acceptedTypes.includes('text/xml')) {
        const content = buildXML(recipe);
        respondMeta(request, response, 200, content, 'text/xml');
      } else {
        // //console.log(recipe)
        respondMeta(request, response, 200, JSON.stringify(recipe), 'application/json');
      }
    } else {
      // console.log("Correct query search, incorrect search terms")
      notCorrect(request, response, acceptedTypes);
    }
  }
};

const getRecipes = (request, response, params, acceptedTypes, httpMethod) => {
  const { food, tag } = params.query;
  if (food === undefined || tag === undefined) {
    // console.log("No search querys found")
    // notCorrect(request, response, acceptedTypes)
    /* /*No search querys found */
    if (userSearchParameters.length === 0) {
      userSearchParameters.push(defaultRecipe);
      // userSearchParameters.push(defaultRecipe)
    }

    if (acceptedTypes.includes('text/xml')) {
      const content = buildXML(userSearchParameters);
      respond(request, response, 200, content, 'text/xml');
    } else {
      /// /console.log(recipe)
      // const content = buildXML(userSearchParameters);
      respond(request, response, 200, JSON.stringify(userSearchParameters), 'application/json');
    }
  } else {
    let recipe;
    for (let i = 0; i < userSearchParameters.length; i += 1) {
      const recipeObj = userSearchParameters[i];
      if (recipeObj.food === food && recipeObj.tag === tag) {
        recipe = recipeObj;
      }
    }
    if (recipe !== undefined) {
      // console.log("normal GET from querys")
      /* normal GET from querys */
      if (acceptedTypes.includes('text/xml')) {
        const content = buildXML(recipe);
        respond(request, response, 200, content, 'text/xml');
      } else {
        // //console.log(recipe)
        respond(request, response, 200, JSON.stringify(recipe), 'application/json');
      }
    } else {
      // console.log("Correct query search, incorrect search terms")
      respond(request, response, 200, JSON.stringify(userSearchParameters), 'application/json');
    }
  }
};

const getPlaylist = (request, response, params, acceptedTypes, httpMethod) => {
  const {
    food, tag, id, name,
  } = params.query;
  if (food === undefined || tag === undefined || id === undefined) {
    // console.log("No search querys found PLAYLIST")
    // notCorrect(request, response, acceptedTypes)
    /* /*No search querys found */

    if (userRecipes.length === 0) {
      userRecipes.push(temp);
      // userRecipes.push(temp)
      // userSearchParameters.push(defaultRecipe)
    }

    if (acceptedTypes.includes('text/xml')) {
      const content = buildXML(userRecipes);
      respond(request, response, 200, content, 'text/xml');
    } else {
      /// /console.log(recipe)
      // const content = buildXML(userSearchParameters);
      respond(request, response, 200, JSON.stringify(userRecipes), 'application/json');
    }
  } else {
    let recipe;
    for (let i = 0; i < userRecipes.length; i += 1) {
      const recipeObj = userRecipes[i];
      if (recipeObj.food === food && recipeObj.tag === tag) {
        recipe = recipeObj;
      }
    }
    if (recipe !== undefined) {
      // console.log("normal PLAYLIST GET from querys")
      /* normal GET from querys */
      if (acceptedTypes.includes('text/xml')) {
        // const content = buildXML(recipe);
        // respond(request, response, 200, content, 'text/xml');
      } else {
        // //console.log(recipe)
        respond(request, response, 200, JSON.stringify(recipe), 'application/json');
      }
    } else {
      // console.log("Correct query PLAYLIST search, incorrect search terms")
      notCorrect(request, response, acceptedTypes);
    }
  }
};

module.exports = {
  notFound,
  getRecipes,
  postRecipesJSON,
  postRecipePlaylist,
  getPlaylist,
  getRecipesMeta,
  getPlaylistMeta,
  changeRecipeName,
  deleteRecipe,
};
