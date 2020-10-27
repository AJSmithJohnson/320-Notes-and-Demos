

// require module:
const dgram = require("dgram");//contains definition for class

// create UDP socket:
//The createSocket() method returns a socket object 
const sock = dgram.createSocket('udp4'); //we are using type and callback instead of options and callback

// create a packet (datagram)//within UDP protocol they don't call packets messages they call them datagrams
const packet = Buffer.from("Hello world!");
// send a packet:
sock.send(packet, 0, packet.length, 320,  "127.0.0.1", ()=>{

	console.log("packet sent :)");
	sock.close();//just to avoid manually canceling stuff socket automatically closes\
});