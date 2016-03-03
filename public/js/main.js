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
    displayChat(msg);
  });

  const form = document.querySelector('form');
  const name = document.querySelector('input[name="name"]');
  const text = document.querySelector('input[name="text"]');
  const ul = document.querySelector('ul');

  //submitting the form
  form.addEventListener('submit', () => {

    const chat = {
      name: name.value,
      text: text.value
    };

    //emitting an event in websocket for the server side
    ws.emit('sendChat', chat);

    displayChat(chat);

    text.value = '';
    //preventing deafult parameters to show up on the browser when submitting a form.
    event.preventDefault();
  });

  //Appending to the dom and passing elements.
    function displayChat (chat) {
    const li = generateLI(chat.name, chat.text);

    ul.appendChild(li);
  };

  //appending name and text in memmory for websockets to listen.
  function generateLI (name, text) {
    const li = document.createElement('li');
    const textNode = document.createTextNode(`${name}: ${text}`);

    li.appendChild(textNode);
    return li;
  };

  function getJSON (url, cb) {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.onload = () => {
      cb(JSON.parse(request.responseText));
    }

    request.send();
  }

  document.addEventListener('DOMContentLoaded', () => {
    getJSON('/chats', chats => {
      chats.forEach(chat => displayChat);
    });
  });

})();
