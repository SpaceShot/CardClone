"use strict";

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

let connection = new signalR
    .HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

connection.on('ReceiveMessage', function (user, message) {
    const messageList = document.getElementById('messagesList')
    const newListItem = document.createElement('li');

    newListItem.appendChild(document.createTextNode(`${user}: ${message}`));
    messageList.appendChild(newListItem);
});

ready(() => {
    connection.start().then(function () {
        document.getElementById('sendButton').disabled = false;
        console.log("connection started");
    });

    document.getElementById('sendButton').addEventListener('click', function (event) {
        const user = document.getElementById('userInput').value;
        const message = document.getElementById('messageInput').value;

        connection.invoke('SendMessage', user, message);

        event.preventDefault();
    });

    document.getElementById('sendButton').disabled = true;
});