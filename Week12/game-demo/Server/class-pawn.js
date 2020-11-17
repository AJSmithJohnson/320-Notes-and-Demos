const NetworkObject = require("./class-networkobject.js").NetworkObject;

exports.Pawn = class Pawn extends NetworkObject{
	constructor(){
		super();//calls the superclasses constructor//which in this case is the one on the class-networkObject
		this.classID = "PAWN";
	}

}

new exports.Pawn();
new exports.Pawn();
new exports.Pawn();
new exports.Pawn();
new exports.Pawn();
const p = new exports.Pawn();
console.log(p);