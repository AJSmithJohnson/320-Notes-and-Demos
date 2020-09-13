//Need to require node js module
const net = require("net");

var defaultPort = 320;

var codeNumber = 0;

const clients = []; //AN empty array of all connected clients

const client = {
	name : "A" +  codeNumber,
	c : "",
	port : defaultPort,
	//testFunction : function() { return "This object was added" }

}

const server = net.createServer({}, (socketToClient)=>{

	//increase codenumber
	codeNumber++;
	//create a new object from the available prototype
	newClient = Object.create(client);


	//set the connectionLIstener to the "c" variable in our client prototype
	newClient.c = socketToClient;
	
	clients.push(newClient)
	//We create the event listeners for the connection listener
	newClient.c.on("error", errMsg=>{
		console.log("There was an error" + errMsg);
	});
	newClient.c.on('close', ()=>{
		console.log("clinet"  + newClient.name + "has disconnected");
		clients.splice(clients.indexOf(newClient), 1);
		console.log(client.length);
	});
	newClient.c.on("data", txt=>{
		console.log("Client" + newClient.name + txt );

	});

	//push the client into the array
	
	//for debugging porpuses *purposes?
	//print the newclients namme
	console.log(newClient.name);
	//print the length of the clients array
	console.log(clients.length);

	
});





//THIS WON'T WOrk because the object has not been conncted yet
/*server.listen({port: clients[1].port}, ()=>{
	console.log("WILL THIS WORK");
})*/

server.listen({port : defaultPort}, ()=>{
	console.log("Server IS Listening")
});