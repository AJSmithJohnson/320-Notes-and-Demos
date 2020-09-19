const net = require('net');//we need to require the net package to actually work with node


class Client {
	//Our constructor gets a link to the socket and server objects
	constructor(socket, server)
	{
		//We need a username for the client
		this.username = "";
		//We need a ipAddress for the client
		this.ipAddress = "";
		//We need to store a reference to the socket the client is connected to
		this.socket = socket;
		//We need to store a reference to the server
		this.server = server;
	}

	//Our clients methods
	onError(errMsg){
		console.log(this.username + "You have had an error : " +errMsg);
	}

	onDisconnect(){
		//TODO: Call the servers remove clients method
	}
	onData(data)
	{
		
	}
}



//A javascript object for creating packets
const Packet = {


}