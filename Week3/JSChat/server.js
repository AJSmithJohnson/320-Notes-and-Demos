const net = require('net');


//SO I think I have a pretty good handle on how my code flows
//REMEMBER TO JUST READ THROUGH IT




//our packet factory
//represents our protocol
const Packet = {
	charEndofPacket: "\n",
	charDelimiter: "\t",
	buildChat:function(usernameFrom,message){//since we are in an object we don't need an arrow function
		return this.buildFromParts(["CHAT", usernameFrom, message]);
	},
	buildAnnouncement:function(message){
		return this.buildFromParts(["ANNC", message]);
	},
	buildNameOkay:function(){
		return this.buildFromParts(["NOKY"]);
	},
	buildNameBad:function(error){
		return this.buildFromParts(["NBAD", error], );
	},
	buildDM:function(usernameFrom,message)
	{
		return this.buildFromParts(["DMSG", usernameFrom, message]);
	},
	buildList:function(arrofClients)
	{
		const arrayOfUsernames = [];

		arrofClients.forEach(c=>{
			if(c.username)arrayOfUsernames.push(c.username);
			else arrayOfUsernames.push(c.socket.localAddress);
		});

		arrayOfUsernames.unshift("LIST");//we add list to the beginning so that we know what packet it is

		return this.buildFromParts(arrayOfUsernames);
	},
	buildFromParts:function(arr){//passes in an array of parts for the packet //the opisite of a split
		return arr.join(this.charDelimiter)+this.charEndofPacket;
	}
}

class Client {
	constructor(socket, server){
		this.buffer = "";
		this.username = "";
		this.socket = socket;
		this.server = server;
		this.socket.on("error", (e)=>this.onError(e));
		this.socket.on("close", ()=>this.onDisconnect());
		this.socket.on("data", (d)=>this.onData(d));
	}

	onError(errMsg){
		console.log("error with" + this.socket.localAddress + " : " + errMsg);
	}
	onDisconnect(){
		//remove this client object from the server list:
		//server.clients.splice(server.client.indexOf(this), 1);
		server.onClientDisconnect(this);
	}
	onData(data){
		
		// "DMSG\tNick\tHello"
		//"world!\n"
		//We don't know how much data we have in a packet if we have a entire packet or part of one
		this.buffer += data;
		//This splits the buffer into packets(or our high level abstraction of packets) //we will almost always get two packets //one with data and another with an empty string
		const packets = this.buffer.split("\n"); //THis results in an arrawy of strings
		
		//remove last item in array
		//and set the buffer to it:
		//which is going to be an empty string which will get the packet concatonated on it
		this.buffer = packets.pop();

		console.log(packets.length + "new packets recieved from" + this.socket.localAddress);
		packets.forEach(p=>this.handlePacket(p));
	}
	handlePacket(packet){
		const parts = packet.split("\t");
		switch(parts[0])
		{
			case "CHAT":
				//build a packet//which is called in serverbroadcast
				//call server.broadcast
				server.broadcast(Packet.buildChat(this.username, parts[1]));//we use parts 1 (which is the second piece of the packet) which should be the message
				break;
			case "DMSG":
			break;
			case "NAME":

				const newName = parts[1];

				//TODO: accept or reject new name
				this.username = newName;
				//TODO: THen we would send off a packet to the user that lets them know their username was accepted
				this.sendPacket(Packet.buildNameOkay());

				//TODO: Send LIST packet to all users
			break;
			case "LIST":

				
				this.sendPacket(  Packet.buildList(this.server.clients) );

			break;

		}
		
	}

	sendPacket(packet)
	{
		this.socket.write(packet);
	}
}

class Server{
	constructor(){

		this.port = 320;
		this.clients = []; //a array of currently connected clients
		this.socket = net.createServer({}, c=>this.onClientConnect(c));//map event handle to call function
		this.socket.on('error', e=>this.onError(e));//we pass an error function to onError
		this.socket.listen({port: this.port}, ()=>this.onStartListen());
	}

	onStartListen(){
		console.log("Server is listening on port " + this.port);
	}

	onClientConnect(socketToClient){ //This recieves parameter that is the socket for the client to connect
		//Inside of this event the this keyword will refer to the event //but because we mapped an arrow function above this should refer to the correct object(not the event)
		//console.log("A new client connected from " + socketToClient.localAddress);
		//this.clients.push(socketToClient); //pushing the socket that connects to the client in the array of clients//because we are using client objects this is outdated
		const client = new Client(socketToClient, this);//pass the client socket into our client object //"this" is a reference to the server object
		this.clients.push(client);//push the new client object into our array with the socketToClientobject in the client\\
		//todo: broadcast a LIST packet to everyone
	}
	onClientDisconnect(client){
		//remove this client object from the server list:
		this.clients.splice(this.clients.indexOf(client), 1);
		//todo: broadcast a LIST packet to everyone
	}
	onError(errMsg)
	{
		console.log("OH NO " + errMsg );
	}

	broadcast(packet){
		//Sends a packet to all connected client
		this.clients.forEach(c=>{
			c.sendPacket(packet);
		});
	}
	
}

const server = new Server();//instantiate a new server\\

console.log(Packet.buildFromParts(["CHAT","NICK", "HELLOW WORLD"]));