//In javascript functions are first class citizens
//In javascript functions are objects
//we can do a ton of different things in javascript that we can't do in other languages


//
//This is a single command issued
//this is an anonymous function
var sayHello = function(){ console.log("Hello there"); };


console.log(sayHello);


function doFunction(f)
{
	f();
}

doFunction(sayHello);


doFunction( function(){console.log("WOOOAAAAAHH"); } );


//ES6 or ecmascript 6 added arrow functions

const square = function(n){ return n*n; };

//arrow function looks like this
const squareOther = (n)=>{return n*n; };
//it is also common to not see the paranthesis
//we actually don't need the curly braces or the return statement
const squareThree = n => n*n;

const mult = (a,b) => { return a*b; };

console.log( square(12) );
console.log( squareOther(12) );
console.log( squareThree(12) );
console.log( mult(12, 3) );

//a real scenario for anonymous functions:
//javascript does not have a for each loop
//inside of the array prototype(also known as array class)
//we can
var people = ["Andrew", "Time", "Bob", "Will"];

//we create a temp variable called item then passing in a function
//so item kind of becomes each thing in the for each array
people.forEach(  item=>{
	console.log(item);
} );