exports.Game = class Game{
	constructor(server){
		this.frame = 0;
		this.time = 0;
		this.dt = 16 / 1000; //this is deltaTime in seconds
		this.timeUntilNextStatePacket = 0;
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
		this.frame++;
		//this.ballPos.x = Math.sin(this.time) * 2;
		const player = this.server.getPlayer(0);//return nth client

		//console.log(this.ballPos.x + "This is the ball position");
		if(player){//if we have at least one player
			//console.log(player.input.axisH);
			this.ballPos.x += player.input.axisH * 1 * this.dt; //ball moves 1 meter per second
		}

		if(this.timeUntilNextStatePacket > 0){//this is used to throttle packets sent so we don't overload the client
			//count down
			this.timeUntilNextStatePacket -= this.dt;
		} else {
			this.timeUntilNextStatePacket = -.1; //send 10% of the packets( ~ 1/6 frames)
			this.sendBallPos();
		}

		

		setTimeout(()=>this.update(),16); // setTimeout allows us to call a function after a certain amount of time 
		//^so after 16 milliseconds we call this.update() this is at the end so we kind of recourse into this
	}//end of update
	sendBallPos(){//A function to send the balls position to all clients
		const packet = Buffer.alloc(20);//we allocate 16 bytes of memory
		packet.write("BALL", 0);//we write in 4 ascii characters at an offset of 0
		packet.writeUInt32BE(this.frame, 4);
		packet.writeFloatBE(this.ballPos.x, 8);
		packet.writeFloatBE(this.ballPos.y, 12);
		packet.writeFloatBE(this.ballPos.z, 16);
		this.server.sendPacketToAll(packet);
	}

}//End of game class
