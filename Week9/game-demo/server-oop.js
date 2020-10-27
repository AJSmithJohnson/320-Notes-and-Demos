class Game{
	constructor(server){
		this.time = 0;
		this.dt = 16 / 1000; //this is deltaTime in seconds
		this.ballPos = {
			x: 0,
			y: 0,
			z: 0
		};

		this.server = server;
		this.update();
	}//end of constructor
	update(){
		//Server needs to be authoritative
		//The server is the only place where we should save the balls state
		//in unity we are going to have a ball and the server is going to move the ball back and forth
		this.time += this.dt;

		this.ballPos.x = Math.sin(this.time) * 2;

		//tell server to send packets to all clients....
		this.sendBallPos();

		setTimeout(()=>this.update(),16); // setTimeout allows us to call a function after a certain amount of time 
		//^so after 16 milliseconds we call this.update() this is at the end so we kind of recourse into this
	}//end of update
	sendBallPos(){//A function to send the balls position to all clients
		const packet = Buffer.alloc(16);//we allocate 16 bytes of memory
		packet.write("BALL", 0);//we write in 4 ascii characters at an offset of 0
		packet.writeFloatBE(this.ballPos.x, 4);
		packet.writeFloatBE(this.ballPos.y, 8);
		packet.writeFloatBE(this.ballPos.z, 12);
		this.server.broadcastToConnectedClients(packet);
	}

}//End of game class

class Server {
	constructor(){

		this.clients = [];

		//create socket:
		this.sock = require("dgram").createSocket("udp4");

		//setup event-listeners:\
		this.sock.on("error", (e)=>this.onError(e));

		this.sock.on("listening", ()=>this.onStartListen());
		this.game = new Game(this);

		this.sock.on("message", (msg, rinfo)=>this.onPacket(msg, rinfo));
		//start listening:
		this.port = 320;
		this.sock.bind(this.port);

	}//end of constructor
	onError(e){
		console.log("ERROR: "+ e);
	}//End of onError
	onStartListen(){
		console.log("IM LISTENING TO YOU SEND ME YOUR INFO FOOLS");
	}//End of onStartListen
	onPacket(msg, rinfo){
		if(msg.length < 4) return;
		const packetID = msg.slice(0,4).toString();
		switch(packetID){
			case "JOIN":
			if(!this.doesClientExist(rinfo))this.clients.push(rinfo);
			
			//normally we would want a full client class and we aren't removing this when the client disconnects so there is a memory leak here
			break;

		}//END of switch(packetID)

		
		console.log("MESSAGE received from " + rinfo.address+ " : " + rinfo.port);
	}//End of onPacket

	doesClientExist(rinfo)
	{
		let value = false;


		this.clients.forEach(c=>{
			if(c.address == rinfo.address && c.port == rinfo.port) value = true; 
		});//this.clients forEach loop

		return value;
	}

	broadcastToConnectedClients(packet){//broadcast isn't a good name for this function, there is a networking concept called broadcasting
		//192.168.1.0 // netmask
		//192.168.1.1 // gateway
		//192.168.1.255 // broadcast IP 
		//if you wanted to detect every game on a network you would use the broadcast IP and just ping every game on the network

		this.clients.forEach(c=>{
			this.sock.send(packet, 0,packet.length, c.port, c.address, ()=>{} ); //if we want a callback we could put one in but we don't really need it for this example
		});//End of forEachloop inside of broadcast
	}//End of broadcast 

}//End of server class





//const game = new Game();// we are creating the game object up above in ther server we don't a ctually need this

// we could user a singleton
//or we could just say server something or other
//we are going to just say
new Server();