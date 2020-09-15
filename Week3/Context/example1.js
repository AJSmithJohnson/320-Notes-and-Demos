
//'this keyword' specifically how does the 'this' keyword work

//most programming languages oop 'this' refers to the object containing the code


const cat = 'meow' //global variable
//anything that exists in the global scope has access to this

function doSomething(){

	console.log(cat);
}

doSomething();

console.log(this);//will print out empty object //in browser instead of node.js 'this' refers to the browser itself


//console.log(global);//Will print out the global object

function example1()
{
	console.log(this);//Will print out global object
}


class Example2 {
	constructor(){
		console.log(this);
	}
}

new example1(); //no longer points to global object points to constructor

new Example2(); //no longer points to global object will point to constructor