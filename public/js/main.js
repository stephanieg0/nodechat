;(function () {
  'use strict';

  const ws = io.connect();

  //websocket connect refering to io.connect().
  ws.on('connect', () => {
    console.log('socket connected');
  });
  //listeting on second event coming from server side.
  ws.on('receiveChat', msg => {
    console.log(msg);
    displayChat(msg.name, msg.text);
  });

  const form = document.querySelector('form');
  const name = document.querySelector('input[name="name"]');
  const text = document.querySelector('input[name="text"]');
  const ul = document.querySelector('ul')

  //submitting the form
  form.addEventListener('submit', () => {

    const n = name.value;
    const t = text.value;

    //emitting an event in websocket for the server side
    ws.emit('sendChat', {
      name: n,
      text: t
    });

    displayChat(n, t);

    text.value = '';
    //preventing deafult parameters to show up on the browser when submitting a form.
    event.preventDefault();
  });

  //Appending to the dom and passing elements.
    function displayChat (name, text) {
    const li = generateLI(name, text);

    ul.appendChild(li);
  };

  //appending name and text in memmory.
  function generateLI (name, text) {
    const li = document.createElement('li');
    const textNode = document.createTextNode(`${name}: ${text}`);

    li.appendChild(textNode);
    return li;
  };

})();
