

export const getRequest = (e, URL, requestHeaderType) => {
// remember that an `Event` object gets passed along every time that an event handler or listener calls a function
// the `target` property of that event points at the element that sent the event, in this case a button
console.log(`An element of id=${e.target.id} was clicked!`);
const xhr = new XMLHttpRequest();
xhr.onload = handleResponse;
xhr.open("GET", URL);
console.log(xhr);
xhr.setRequestHeader('Accept', requestHeaderType);
xhr.send();
}



      
      
      