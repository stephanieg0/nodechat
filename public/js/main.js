;(function () {
  'use strict';

  const ws = io.connect();

  //websocket connect refering to io.connect().
  ws.on('connect', () => {
    console.log('socket connected');
  });
  //listeting on second event coming from server side.
  ws.on('receiveChat', msgs => {
    //recieving an array of objects.
    msgs.forEach(displayChat);
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
    if (!document.querySelector(`[data-id="${chat._id}"]`)) {
      const li = generateLI(chat);

      ul.appendChild(li);
    }
  };

  //appending name and text in memmory for websockets to listen.
  function generateLI (chat) {
    const li = document.createElement('li');
    const textNode = document.createTextNode(`${chat.name}: ${chat.text}`);
    const dataId = document.createAttribute('data-id');

    dataId.value = chat._id

    li.setAttributeNode(dataId);
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

  //document.addEventListener('DOMContentLoaded', () => {
    //getJSON('/chats', chats => {
      ////passing the function that has the db object
      //chats.forEach(displayChat);
    //});
  //});

})();
