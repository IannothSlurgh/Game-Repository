// This node.js program implements a simple chat room service.

// The node.js HTTP server.
var app = require('http').createServer(handler);

// The socket.io WebSocket server, running with the node.js server.
var io = require('socket.io').listen(app);

// Allows access to local file system.
var fs = require('fs')

// Listen on a high port.
app.listen(16382);

function handler(request, response) {
  // This will read the file 'index.html', and call the function (the 2nd
  // argument) to process the content of the file.
  // __dirname is a preset variable pointing to the folder of this file.
  fs.readFile(
    __dirname + '/index.html',
    function(err, content) {
      if (err) {
        // If an error happened when loading 'index.html', return a 500 error.
        response.writeHead(500);
        return response.end('Error loading index.html!');
      }
      // If no error happened, return the content of 'index.html'
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(content);
    });
}

var clients = [];

io.sockets.on(
  'connection',
  function(client) {
    // Send a welcome message first.
    client.emit('msg', 'Login');

    // Listen to an event called 'login'. The client should emit this event when
    // it wants to log in to the chat room.
    client.on(
      'login',
      function(message) {
        // This function extracts the user name from the login message, stores
        // it to the client object, sends a login_ok message to the client, and
        // sends notifications to other clients.
        if (message && message.user_name) {
          client.set('user_name', message.user_name);
		  clients.push(message.user_name);
          client.emit('login_ok');
          // client.broadcast.emits() will send to all clients except the
          // current client. See socket.io FAQ for more examples.
          client.broadcast.emit('notification',
                                message.user_name + ' entered the room.');
          return
        }
        // When something is wrong, send a login_failed message to the client.
        client.emit('login_failed');
      });

    // Listen to an event called 'chat'. The client should emit this event when
    // it sends a chat message.
    client.on(
      'chat',
      function(message) {
        // This function tries to get the user name from the client object, and
        // use that to form a chat message that will be sent to all clients.
        if (message && message.msg) {
          client.get(
            'user_name', 
            function(err, name) {
              if (!err) {
                // io.sockets.emit() will send the message to all clients,
                // including the current client. See socket.io FAQ for more
                // examples.
				var obj = { "user_name": name, "msg": message.msg };
                client.broadcast.emit('chat', JSON.stringify(obj));
              }
            });
        }
      });
	  
	client.on(
	  'userlist',
	  function(message){
	    client.get(
            'user_name', 
            function(err, name) {
              if (!err) {
                // io.sockets.emit() will send the message to all clients,
                // including the current client. See socket.io FAQ for more
                // examples.
				var obj = { "user_name": name};
                io.sockets.emit('userlist', JSON.stringify(obj));
				for(var j = 0; j < clients.length; j++)
				{
					if(clients[j] != name)
					{
						console.log('I Entered the loop');
						var others = { "user_name": clients[j]};
						client.emit('userlist', JSON.stringify(others));
					}
				}
              }
            });
	});
	
	client.on(
		'getusername',
		function(message){
		  if(!err) {
			var obj = { "user_name": name};
			client.emit('getusername', JSON.stringify(obj));
		  }
	});
	
    // Print a message when somebody left.
    client.on(
      'disconnect',
      function() {
        client.get(
          'user_name',
          function(err, name) {
            if (name) {
              io.sockets.emit('notification', name + ' left the room.');
            }
          });
      });
  });
