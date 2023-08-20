const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

const peer = new Peer(); // Generate a unique peer ID
const connections = {}; // To keep track of all connected peers

peer.on('open', id => {
  console.log('My peer ID is: ' + id);
});

peer.on('connection', connection => {
  setupConnection(connection);
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    displayMessage(`Me: ${message}`);
    broadcastMessage(message);
    messageInput.value = '';
  }
});

function setupConnection(connection) {
  connections[connection.peer] = connection;

  connection.on('data', data => {
    displayMessage(`${connection.peer}: ${data}`);
  });

  connection.on('close', () => {
    displayMessage(`${connection.peer} has left the chat.`);
    delete connections[connection.peer];
  });

  displayMessage(`${connection.peer} has joined the chat.`);
}

function broadcastMessage(message) {
  Object.keys(connections).forEach(peerId => {
    const connection = connections[peerId];
    if (connection.open) {
      connection.send(message);
    }
  });
}

function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messagesDiv.appendChild(messageElement);
}

window.addEventListener('beforeunload', () => {
  Object.keys(connections).forEach(peerId => {
    connections[peerId].close();
  });
});




const hostIdInput = document.getElementById('hostIdInput');
const connectButton = document.getElementById('connectButton');

connectButton.addEventListener('click', () => {
  const hostId = hostIdInput.value;
  if (hostId) {
    const connection = peer.connect(hostId);
    setupConnection(connection);
  }
});