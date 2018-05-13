// import socket

const HOST = ''
const PORT = 9876
const ADDR = [HOST, PORT]
const BUFSIZE = 4096

// var WebSocketServer = require("ws").Server;
var exampleSocket = new WebSocket('ws://localhost:54286')

exampleSocket.onmessage = function (event) {
	console.log("recieved message")
  console.log(event.data);
}

exampleSocket.onopen = function() {
                  // Web Socket is connected, send data using send()
                  // ws.send("Message to send");
                  exampleSocket.send("Here's some text that the server is urgently awaiting!");
                  // alert("Message is sent...");
                  console.log("sent msg")
               };

exampleSocket.onmessage = function (evt) {
  var received_msg = evt.data;
  console.log("Message is received...");
  console.log(evt.data)
};

exampleSocket.onclose = function() {
  // websocket is closed.
  console.log("Connection is closed...");
};

// serv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

// serv.bind(ADDR)
// serv.listen(5)

// print 'listening ...'

// while True:
//   conn, addr = serv.accept()
//   print 'client connected ... ', addr
//   myfile = open('eqs_100k_recieved.tsv', 'w')

//   while True:
//     data = conn.recv(BUFSIZE)
//     if not data: break
//     myfile.write(data)
//     print 'writing file ....'

//   myfile.close()
//   print 'finished writing file'
//   conn.close()
//   print 'client disconnected'
