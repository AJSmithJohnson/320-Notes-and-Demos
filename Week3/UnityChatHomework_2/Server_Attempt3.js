const net = require('net');


class Server
{
	constructor()
	{
		this.port = 320;
		this.clientList = []; //list of clients
		this.socket = net.createServer({}, c=>this.onClientConnect(c));
		this.socket.on('error', e=>this.onError(e));
		this.socket.listen({port: this.port}, ()=>this.onStartListen());
	}

	onStartListen()
	{
		console.log("Server is listening on port " +this.port);
	}

	onClientConnect(socketToClient)
	{
		const client = new Client(socketToClient, this);
		this.clientList.push(client);
		this.clientList.forEach(c=>{
			c.handlePacket("LIST");
		});
	}
	onClientDisconnect(client)
	{
		console.log(Packet.buildFromParts(["NAME", client.userName]));//Originally on clientList
		this.clientList.splice(this.clientList.indexOf(client), 1);
		console.log(this.clientList.length);
		this.clientList.forEach(c=>{//THis was also originally on client list
			c.handlePacket("LIST");
			});
		/*if(this.clientList.length > 0)
		{
			
			
		}
		else
		{
			this.clientList.forEach(c=>{
			c.sendPacket("CHAT" + "\t" + "There are no valid users");
			console.log("NO MORE USERS");
			});
		}*/
	}
	onError(errMsg)
	{
		console.log("OH NO" + errMsg);
	}
	broadcast(packet)
	{
		this.clientList.forEach(c=>{
			c.sendPacket(packet);
		});
	}

}//End of server\






class Client
{
	constructor(socket, server)
	{
		this.buffer = "";
		this.userName = "";
		this.socket = socket;
		this.server = server;
		this.socket.on('error', (e)=>this.onError(e));
		this.socket.on('close', ()=> this.onDisconnect());
		this.socket.on('data', (d)=>this.onData(d));
	}
	onError(errMsg)
	{
		console.log("Error with " + this.userName + " @ " + this.socket.localAddress + " : " + "errMsg");
	}
	onDisconnect()
	{
		server.onClientDisconnect(this);


	}
	onData(data)
	{
		this.buffer += data;
		const packets = this.buffer.split("\n");
		this.buffer = packets.pop();
		console.log(packets.length + "new packets recieved from " + this.socket.localAddress + " : " + this.userName);
		packets.forEach(p=>this.handlePacket(p));
	}
	handlePacket(packet)//HERE WE ARE SENDING OFF THE PACKETS FROM THE SERVER
	{
		const parts = packet.split("\t");
		switch(parts[0])
		{
			case "CHAT":
			this.server.broadcast(Packet.buildChat(this.userName, parts[1]));
			break;
			case "DMSG":

			break;
			case "NAME":
			const newName = parts[1];
			//CHECK NAME


			this.userName = newName;

			this.sendPacket(Packet.buildNameOkay());
			break;
			case "LIST":
			this.sendPacket( Packet.buildList(this.server.clientList));
			break;
		}//End of switch Statement
	}//End of handlePacket

	sendPacket(packet)
	{
		this.socket.write(packet);
	}
}


const Packet = 
{
	charEndOfPacket: "\n",
	charDelimiter: "\t",
	buildChat: function(usernameFrom, message)
	{
		return this.buildFromParts(["CHAT", usernameFrom, message]);
	},//End of build chat
	buildAnnouncement: function([message])
	{
		return this.buildFromParts(["ANNC", message]);
	},
	buildNameOkay: function()
	{
		return this.buildFromParts(["NOKY"]);
	},
	buildNameBad:function(error)
	{
		return this.buildFromParts(["NBAD", error]);
	},
	buildDM:function(usernameFrom, message)
	{
		return this.buildFromParts(["DMSG", usernameFrom, message]);
	},
	buildList:function(arrayOfClients)
	{
		const arrayOfUsernames = [];

	
			arrayOfClients.forEach(c=>{
				if(c.userName)arrayOfUsernames.push(c.userName);
				else arrayOfUsernames.push(c.socket.localAddress);
			});
		arrayOfUsernames.unshift("LIST");

		return this.buildFromParts(arrayOfUsernames);	
	},
	buildFromParts: function(arr)
	{
		return arr.join(this.charDelimiter) + this.charEndOfPacket;
	}
}

const server = new Server();






