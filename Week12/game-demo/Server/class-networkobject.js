

exports.NetworkObject = class NetworkObject{
	
	static _idCount = 0;


	constructor(){

		this.classID = "NWOB";

		this.networkID = ++NetworkObject._idCount;//before we assign this individual objects network ID
		//we access the static property and increment it

	}

	serialize(){
		//TODO
	}
	deserialize(){
		//TODO
	}
}

