

exports.Client = class Client {
	constructor(sock, server){
		this.socket = sock; //This socket that the client is on
		this.server = server;//Spahgetti code for convenience each client has access to the server
		this.username = "";

		this.buffer = Buffer.alloc(0);

		this.socket.on("error", (e)=>{this.onError(e)});
		this.socket.on("close", ()=>{this.onClose()});
		this.socket.on("data", (d)=>{this.onData(d)});
	}

	onError(errMsg){
		console.log("Error with client : " + errMsg);
	}

	onClose(){
		this.server.onClientDisconnect(this);
	}

	onData(data){
		//add new data to buffer:
		this.buffer = Buffer.concat([this.buffer, data]);
		//console.log(this.buffer);

		//look through buffer for packets(parse buffer for packets) 
        if(this.buffer.length < 4) return ;//not enough data to process

        const packetIdentifier = this.buffer.slice(0, 4).toString();// starting at 0 we want the first four characters this should be our identifier for our packets
        console.log(packetIdentifier);

        switch(packetIdentifier){
        	case "JOIN": 

        		if(this.buffer.length < 5) return; //not enough data to process
        		const lengthOfUsername = this.buffer.readUInt8(4);//offsetting by four so we can read the fifth bytes
        		console.log(this.buffer);
        		if(this.buffer.length < 5 + lengthOfUsername) return; //not enough data to process
        		const desiredUsername = this.buffer.slice(5, 5+lengthOfUsername).toString();//start at 6 and then slice out from the length of username to take username from buffer

        		//check username
        		console.log("User wants to change name: " +desiredUsername+ "' ");
        		break;
        	case "CHAT": 

        		break;
        	case "PLAY": 

        		break;
        	default: 

        		//don't recognize the packet................ OH NO
        		console.log("ERROR: packet identifier not recognized ("+packetIdentifier+")");
        		this.buffer = Buffer.alloc(0);//empty the buffer
        		break;
        }
		//process packets ( and consume data from buffer)
	}
};