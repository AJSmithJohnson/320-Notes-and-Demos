const NetworkObject = require("./class-networkobject.js").NetworkObject;

exports.Pawn = class Pawn extends NetworkObject{
	constructor(){
		super();//calls the superclasses constructor//which in this case is the one on the class-networkObject
		this.classID = "PAWN";
	}
	update(game){
		this.position.x = Math.sin(game.time);
		console.log(this.position.x);
	}
	serialize(){
		const b = super.serialize();

		//Here we would add additional bytes that are needed for our pawn
		return b;

		//\super.serialize();
	}
	deserialize(){
		//TODO
	}

}

