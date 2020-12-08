
const sock = require("dgram").createSocket("udp4");

sock.on("listening", ()=>{
	console.log("now listening....");
	sock.setBroadcast(true);
});

sock.on("message", ()=>{
	console.log("PacketRECIEVED");
});

sock.bind(320);