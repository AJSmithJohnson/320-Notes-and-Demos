
const obj = {

	x:13
};

//you cannot make //obj = 42
//I can make obj.x = 42

obj.x = 42;

console.log(obj.x);

//properties can be added dynamically

const obj2 = {};

obj2.x = 57;

console.log(obj2.x);

obj2.x += 12;

console.log(obj2.x);


obj.update = function()
{
	console.log("WOW, I'm updating");
};


obj.update();

//before ecmascript 6 older javascript didn't have classes 
//so you did something like
function Person()
{
	this.name = "JIMMY";
	//can't just say name in the anonymouse function below otherwise
	//it won't understand the scrope of the variable
	this.sayHello = ()=>{
		console.log("Hello, I'm " + this.name);
	}
}
var jim = new Person();
console.log(jim.name);
jim.sayHello();


//ES6 introduced classes to JS
//var, let, and const don't scope right inside of ES6 objects
class Sprite{
	//You don't need the function keyword inside of ES6 classes
	//So like in a C# script in unity the void keyword in front of methods we do not need those in Javascript
	constructor()
	{
		this.x = 0;
		this.y = 154;
		this.rotation = 45;
	}
	die(){
		this.isDead = true;
	}
}

//This is how you would create an enemy that is a child class of sprite
class Enemy extends Sprite {
	constructor(){
		super();
	}
	spin(amount){
		this.rotation += amount;
	}
}

