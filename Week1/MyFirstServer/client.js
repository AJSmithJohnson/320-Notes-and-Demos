const net = require('net');

//attempts to connect to server:
//needs two properties
//the port and the host

//reserved ip address for local computer
//called local host 127.0.0.1

//THink of the on as the event listener

const socket = net.connect({port:12345, hot:"127.0.0.1"}, ()=>{

	console.log("You connected to the server!");
});

socket.on("error", errMsg=>{
	console.log("OH NO THERES A BAD THING" + errMsg);
});

socket.on("data", txt=>{\
	console.log("message from server: " + txt);
	socket.write("Thanks friend!");
})