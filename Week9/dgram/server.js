//require  module
const dgram = require("dgram");

// make socket:
const sock = dgram.createSocket("udp4");

// setup event - listeners: //when there is a connection do this//when there is an error do this
sock.on("error", (e)=>{//has a parameter called e for error messages
	console.log("ERROR: " + e);
});

sock.on("listening", ()=>{
	console.log("SERVER LISTENING ...");
});

//has two variables in callback, msg is the info, rinfo is info on who sent something
sock.on("message", (msg, rinfo)=>{  //in tcp they call it data //in udp it is called message
	console.log("--- packet received ---");
	console.log("from  "+rinfo.address+" : "+rinfo.port+" ");
	console.log(msg);
	//console.log(rinfo);
});

// start listening: 
sock.bind(320);