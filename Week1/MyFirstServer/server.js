const net = require('net'); //require net module. Check documentation for features of net

//net.createServer gives us the socket
//net.connect tries to connect to a server
//server is going to have a socket opening where it is listening

//ctrl+shift+escape opens up the task manager

const socketServer = net.createServer( socketClient=>{
	console.log("new connection"); //so after we 
	socketClient.on("error", errorMsg=>{
		console.log("error: " + errorMsg);
	});

	socketClient.write("Hello! Welcome to the Server!");

	
});

//normally we'd pass in an options object for now we are just using an empty object with a port
socketServer.listen({port:12345}, ()=>{ 
	console.log("listening for connections...");
});
//So if we get an error which we determine by the "error" then we run the anonymous function and recieve the errmsg 
socketServer.on("error", (errMsg)=>{
	console.log("didn't work....");
});

