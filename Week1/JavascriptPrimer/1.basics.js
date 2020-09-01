//in javascript we 
//create variables with var
var example = "";
//or
var otherExample = "macaroni";
//other keywords are
let age = 82;
//or we can use
const doILikePizza = true;
//we can't change const to anything
//else
//while not exactly the same
//const is similar to constants in languages
//like C#

//Javascript is untyped. Variables don't
//have datatypes. 
example = 12;
example = true;
example = "ALFREDO";
//Javascript is not type safe so technically everything above
//is allowed

//declaring functions: 

//it is common in Javascript to use camelcase for functions
function doSomething()
{
	if(1== 1)
	{
		return true;
	}
	else
	{
		return "banana";
	}

}

function doSomethingElse(n)
{
	if(example == 2)
	{
		return "WHAT";
	}
}

//arrays

var myArray = [];//this is an empty array
//Arrays can be declared literally
//Writing javascript code is very fast
var students = ["student 1", "Dominic", "Keegan", "Logasn", "Andrew"];
//Arrays in javascript are more like lists than low level arrays

students.push("billy");
console.log(students);

students.push(1, 2, 3, 4, 5,6 , true);

console.log(students);

//javascript does not have structs
//could do something simaler but would not be the same as C++ or C#

//Objects can be literal as well:
var myObj = {};
let myOtherObject {};
//JSON is Javascript object notation
//Literal objects use JSON

myObj= {
	age: 17,
	favoriteColor: "blue",
	isDead: false,
	favoriteBooks: ["Dune", "LOTR"],

};

stuff = [true, 42, {x: 13, y : 22}, null];


