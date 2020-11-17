
exports.Client = class Client{
	
	constructor(rinfo){
		this.rinfo = rinfo;//rinfo contains address and port information

		this.input = {
			axisH:0,//horizontalInput
			axisV:0,//verticalInput
		};//end of this.input

	}//End of constructor
	onPacket(packet){
		if(packet.length < 4) return; //too short not enough info, ignore packets
		const packetID = packet.slice(0, 4).toString();

		switch(packetID){
			case "INPT":
				if(packet.length < 5) return;
				this.input.axisH = packet.readInt8(4);
			break;

			//TODO: Handle all the many wonderful packets

			default:
				console.log("OH NO, packet type not recognized");
			break;
		}//End of switch

	}//end of onPacket
}