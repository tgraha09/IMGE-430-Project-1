// import { getRequest } from "./utilities";

// import {getRequest} from '../src/utilities.js'

// const getRequest = require('.')
const handleResponse = (e) => {
  console.log('e.target', e.target);
  console.log('e.target.response = ', e.target.response);
  const obj = JSON.parse(e.target.response);
  const container = document.querySelector('#jokeContainer');
  console.log(obj);
  obj.forEach((joke) => {
    container.innerHTML += `<section><h3>${joke.q}</h3>
                            <h3>${joke.a}</h3></section>`;
  });
};

const downloadJoke = (e) => {
// remember that an `Event` object gets passed along every time that an event handler or listener calls a function
// the `target` property of that event points at the element that sent the event, in this case a button
  console.log(`An element of id=${e.target.id} was clicked!`);
  // console.log(getRequest);
  const jokeURL = '/random-joke';
  const xhr = new XMLHttpRequest();
  xhr.onload = handleResponse;
  xhr.open('GET', jokeURL);

  xhr.setRequestHeader('Accept', 'application/javascript');
  xhr.send();
};

const downloadFiveJokes = (e) => {
// remember that an `Event` object gets passed along every time that an event handler or listener calls a function
// the `target` property of that event points at the element that sent the event, in this case a button
  console.log(`An element of id=${e.target.id} was clicked!`);

  const jokeURL = '/random-jokes?limit=5';
  const xhr = new XMLHttpRequest();
  xhr.onload = handleResponse;
  xhr.open('GET', jokeURL);
  xhr.setRequestHeader('Accept', 'application/javascript');
  xhr.send();
};

const init = () => {
  // An Event *Handler*
// document.querySelector("#btnJoke").onclick = downloadJoke; // same as below, less typing, use which ever version you prefer

  // An Event *Listener*
  document.querySelector('#btnJoke').addEventListener('click', downloadJoke);
  document.querySelector('#fiveJokes').addEventListener('click', downloadFiveJokes);
// **Actually, event handlers and listeners are NOT exactly the same in all use cases - what ARE the differences?**
};

window.onload = init;
