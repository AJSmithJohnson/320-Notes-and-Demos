
class Server {
	constructor(){
		//create socket:
		this.sock = require("dgram").createSocket("udp4");

		//setup event-listeners:\
		this.sock.on("error", (e)=>this.onError(e));

		this.sock.on("listening", ()=>this.onStartListen());

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
		console.log("MESSAGE received from " + rinfo.address+ " : " + rinfo.port);
	}//End of onPacket

}


// we could user a singleton
//or we could just say server something or other
//we are going to just say
new Server();