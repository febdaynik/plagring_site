var app = {};
app.peer = new Peer();

app.peer.on('open', function(id) {
    document.getElementById('peer-id').innerText = id
});

app.peer.on('connection', function(conn) { // Это хост
    app.conn = conn;
    console.log(conn)
    app.conn.on('open', function() {
        document.getElementById('status').innerText = "Second user success";
    });

    app.conn.on('data', function(data) {
        const page_obj = `<div class="left">
			<div class="username">${data.user_peer_id}</div>
			<div class="user_text">${data.message}</div>
		</div>`
        app.chat_list.push(page_obj);
        document.getElementById('messages').innerHTML = app.chat_list.join('<br>');
    });
});


function connect(){ // Это второй человек, а не хост
    app.conn = app.peer.connect(document.getElementById('partnerPeer').value);
    app.conn.on('open', function() {
        document.getElementById('status').innerText = "Your success";
    });

    app.conn.on('data', function(data) {

        const page_obj = `<div class="left">
			<div class="username">${data.user_peer_id}</div>
			<div class="user_text">${data.message}</div>
		</div>`

        app.chat_list.push(page_obj);
        document.getElementById('messages').innerHTML = app.chat_list.join('<br>');
    });
}

app.chat_list = [];
function sendMessage(){
    var message = document.getElementById('inputmess').value;
    document.getElementById('inputmess').value = '';

    if (message === '') return null;
    if (app.conn && app.conn.open) {
        var peer_id = document.getElementById('peer-id').innerText
        object_message = {'message': message, 'user_peer_id': peer_id};
        console.log(object_message);
        app.conn.send(object_message);
    }

    app.chat_list.push('<div class="right">' + message + '</div>');
    document.getElementById('messages').innerHTML = app.chat_list.join('<br>');

}