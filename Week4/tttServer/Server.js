const Client = require("./Client.js").Client;//taking code from Client.js and mapping it to const Client variable
const PacketBuilder = require("./packet-build.js").PacketBuilder;
/*exports.test = "This is working";

console.log("Server.js is running....");*///we need to use exports to get things in other files

//by using exports we send objects to other scripts
/*exports.Server = class Server {


}*/ //We only want one server though so we don't need a class we can
//use js object notation


//NEXT WEEK PROJECT IS DUE AHHHHHHHHHHHHHHHHHHHH
//OH NOOOOOOOOO

exports.Server = {
	port: 320,
	clients: [], //an array of clients
	maxConnectedUsers : 8,
	/*start: function(){

	}*/ 
	//with syntactic suger we don't need the whole : function()
	start(game){
		this.game = game;
		this.socket = require("net").createServer({}, c=>this.onClientConnect(c));//this.socket is our listening socket
		this.socket.on("error", (e)=>this.onError(e));
		this.socket.listen({port: this.port},()=>this.onStartListen());
	},
	onClientConnect(socket){
		console.log("New connection from " + socket.localAddress);

		if(this.isServerFull()){
			//server is full

			const packet = PacketBuilder.join(9);

			socket.end(packet);

		}else{//Server not full
			//instantiate client
			const client = new Client(socket, this);//create a new client pass in a reference to the socket it is connection from and a reference from the server
			this.clients.push(client);
		}

		
	},
	onClientDisconnect(client)
	{
		//player free up their 'seats'
		if(this.game.clientX == client)this.game.clientX = null;
		if(this.game.clientY == client)this.game.clientY = null;
		const index = this.clients.indexOf(client);//find the object in the array and store it as index variable
		if(index >=0) this.clients.splice(index, 1);//remove the object from the array
	},
	onError(e){
		console.log("ERROR with listener " +e );
	},
	onStartListen(){
		console.log("SERVER IS NOW LISTENING ON PORT " + this.port);
	},
	isServerFull(){
		//return true;
		return (this.clients.length >= this.maxConnectedUsers);
	},
	//THis function returns a response id
	generateResponseID(desiredUsername, client){
		//check username
        		//let responseType = 1;
        		//TODO: check username
    		//1: is player "X" 
	//2: is player "O" 
	//3: is specatator
	//(denied)
	///4: username too short
	//5: username too long
	//6: username has invalid characters
	//7: username already taken
	//8: username not allowed (profane?)
	//9: game is full (NO MORE USERS1)
				if(desiredUsername.length <= 3) return  4;
				if(desiredUsername.length >= 12) return  5;



				//letters(upercase and lowercase)
				//spaces
				//numbers
				const regex1 = /^[a-zA-Z0-9]+$/;//literal regex in JavaScript//upcarrot is beginning // dollar sign is end

				if(!regex1.test(desiredUsername)) return 6;//uses invalid characters!


				let isUsernameTaken = false;

				this.clients.forEach(c=>{//This is effectively a function inside of a loop// so the return statement is valid
					if(c == this) return;
					if(c.username == desiredUsername) isUsernameTaken = true;
				});

				if(isUsernameTaken) return 7;

				const regex2 = /(fuck|shit|damn|faggot)/i;
        		if(regex2.test(desiredUsername)) return 8;

        		if(this.game.clientX == client) {
					this.game.clientX = client;
					return 1;//you are already client X

        		}
        		if(this.game.clientO == client) {
					this.game.clientO = client;
					return 2;//you are already client O
				}
        		if(!this.game.clientX) {
					this.game.clientX = client;
					return 1;//you are new clientX

        		}
        		if(!this.game.clientO) {
					this.game.clientO = client;
					return 2;//you are new clientX

        		}

        		return 3;
        		
        		
	},
	broadcastPacket(packet){
		this.clients.forEach(c=>{
			
				c.sendPacket(packet);
			
		});
	},


};