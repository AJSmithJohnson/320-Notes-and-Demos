const net = require("net"); //we need to import nodeJS net module on both client and server'

//net.connect takes an object and a callback function
//client needs the servers port and the IP address
const socketToServer = net.connect({port:320, ip:"127.0.0.1"}, ()=>{
	console.log("we are now connected to the server");
	socketToServer.write("Hello I am a cleint...");//allows us to write to the buffer
});

socketToServer.on("error", errMsg=>{
	console.log("ERRR" +errMsg);
});

//This is how we recieve info from our TCP socket
socketToServer.on("data", txt=>{//TXT is data available in buffer by default 
//nodeJS treats txt as ascii text
	console.log("Server says" + txt);
});