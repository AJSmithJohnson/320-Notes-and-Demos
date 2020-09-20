const net = require('net');//we need to require the net package to actually work with node



class Server{
	constructor(){

		this.port = 320;//The port the server is active on
		this.clients = []; //an array of currently connected clients
		this.socket = net.createServer({}, c=>this.onClientConnect(c));//map event handle to call function
		this.socket.on('error', e =>this.onError(e));//passes an error event to onError
		this.socket.listen({port: this.port}, ()=>this.onStartListen());
		
	}

	onStartListen()
	{
		console.log("Server is listening on port " + this.port);//We start the server listening so we can get data to and from the server
	}

	onClientConnect(socketToClient)
	{
		const client = new Client(socketToClient);//client gets a reference to the servers socket and the 
		this.clients.push(client);//push the client to the clients array
	}
	onError(errMsg)
	{
		console.log("OH NO" + errMsg);
	}
	//broadcast and onDisconect are now part of the  Serverwide functions object

}



class Client {
	//Our constructor gets a link to the socket and server objects
	constructor(socket)//TOOK SERVER REFERENCE OUT BROADCAST IS ITS OWN OBJECT
	{
		//We need a username for the client
		this.username = "";
		//We need a ipAddress for the client
		this.ipAddress = "";
		//We need to store a reference to the socket the client is connected tfo
		this.socket = socket;
		//We need to store a reference to the server
		//this.server = server;//IF I'm understanding this stuff I won't need a server reference in the client

		//OUR EVENTS
		this.socket.on('error', (e)=>this.onError(e));
		this.socket.on('close', ()=>this.onDisconnect());
		this.socket.on('data', (d)=>this.onData(d));
	}

	//Our clients methods
	onError(errMsg){
		console.log(this.username + "You have had an error : " +errMsg);
	}

	onDisconnect(){
		//TODO: Call the servers remove clients method
		serverWide.onDisconnect(this);
	}
	onData(data)
	{
		this.buffer += data;

		const packets = this.buffer.split("\n");

		this.buffer = packets.pop();

		console.log(packets.listen + "new packets recieved from " + this.socket.localAddress);
		packets.forEach(p=>this.handlePacket(p));
	}
	handlePacket(packet){
		const parts = packet.split("\t");
		switch(parts[0])
		{
			case "CHAT":
				//build a packet//which is called in serverbroadcast
				//call server.broadcast
				serverWide.broadcast(Packet.buildChat(this.username, parts[1]));//we use parts 1 (which is the second piece of the packet) which should be the message
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
	
}//End of client class



//NEED TO FIX THE PROBLEM WITH SERVER NOT BEING THE SAME REFERENCE AS THE SERVER WE INSTANTIATE
//CREATE A FLOW CHART FOR HOW YOUR CODE
class ServerWideFunctions//So any broadcasting or anything else is done through this
{
	constructor()
	{
		this.server = "";
	}

	//so I discovered broadcast is important because it is neccasary to send the chat packets to clients
	//so that they recieve them without broadcast we aren't really sending anything back to the client
	broadcast(packet)
	{
		console.log("here");
		this.server.clients.forEach(c=>{
			console.log(packet);
			c.sendPacket(packet);
		});
	}
	onDisconnect(client)
	{
		this.server.clients.splice(clients.indexOf(client), 1);
		print(this.server.clients);
	}

}

//A javascript object for creating packets
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

const serverWide = new ServerWideFunctions();
const server = new Server();
serverWide.server = server;
