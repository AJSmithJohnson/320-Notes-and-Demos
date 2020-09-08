//Need to require node js module
const net = require("net"); //Imports nodeJS TCP socket module

const clients = []; //This is an array of all currently connected clients

//If stuck go to NODE JS documentation and the .net module then look up the functions 

//Has to take two properties a object that has options, and then a function to call
const listeningSocket = net.createServer({}, (socketToClient)=>{
	console.log(socketToClient.localAddress + " A client has connected");

	clients.push(socketToClient); //add new client into our array of clients

	socketToClient.on("error", errMsg=>{//errorMsg is a parameter that we are passing to a function
		console.log("There was some kind of error" + errMsg );
	});

	socketToClient.on("close", ()=>{//DO NOT USE CAPS ON the close or error 
		console.log("A client has disconnected.....");
		clients.splice(clients.indexOf(socketToClient), 1)//we need the index of the client we are removing(so we have the object we are removing)
		//we also want the number of things we are removing
		console.log(clients.length);
	});

	socketToClient.on("data", txt=>{
		console.log("client says : " + txt );
		//we need to send this message to all connected clients
		BroadcastToAll(txt); //if we didn't want to braodcast to a client we would pass in the client to skip here
	});

	socketToClient.write("Welcome to my server friend.");
}); //net.CreateServer returns a server object which we store into listeningSocket


//in the documentation listening socket is the server in the server.listen example
//it takes an options object which we keep empty
	//The options object has a port that we are listening over
	//port:12345 is commonly used for malware and other bad stuff so maybe don't do that use 320 instead
//it also takes a method call which we just have it print something out\\
listeningSocket.listen({port:320}, ()=>{
	console.log("The server is listening")
	//listeningSocket.close();
} );//End of listeningSocket.listen


function BroadcastToAll(txt, clientToSkip)//FOr now clientToSkip is undefined
{
	clients.forEach(client=>{
		if(client != clientToSkip) client.write(txt);//THis would be if we wanted to add like a chat filter thing
		//client.write(txt);
	});//For each client we pass in the client
}

/*function handleError(errMsg){

}*/