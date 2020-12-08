
const sock = require("dgram").createSocket("udp4");


const packet = Buffer.from("hello world");

//instead of passing in IP address you can pass in undefined
//we do need to make sure we pass in the correct port
sock.send(packet, 0, packet.length, 320, undefined, ()=>{
	sock.close();
});