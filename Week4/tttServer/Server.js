const Client = require("./Client.js").Client;//taking code from Client.js and mapping it to const Client variable

/*exports.test = "This is working";

console.log("Server.js is running....");*///we need to use exports to get things in other files

//by using exports we send objects to other scripts
/*exports.Server = class Server {


}*/ //We only want one server though so we don't need a class we can
//use js object notation


exports.Server = {
	port: 320,
	clients: [], //an array of clients

	/*start: function(){

	}*/ 
	//with syntactic suger we don't need the whole : function()
	start(){
		this.socket = require("net").createServer({}, c=>this.onClientConnect(c));//this.socket is our listening socket
		this.socket.on("error", (e)=>this.onError(e));
		this.socket.listen({port: this.port},()=>this.onStartListen());
	},
	onClientConnect(socket){
		console.log("New connection from " + socket.localAddress);

		const client = new Client(socket, this);//create a new client pass in a reference to the socket it is connection from and a reference from the server
		this.clients.push(client);
	},
	onClientDisconnect(client)
	{
		const index = this.clients.indexOf(client);//find the object in the array and store it as index variable
		if(index >=0) this.clients.splice(index, 1);//remove the object from the array
	},
	onError(e){
		console.log("ERROR with listener " +e );
	},
	onStartListen(){
		console.log("SERVER IS NOW LISTENING ON PORT " + this.port);
	}


}