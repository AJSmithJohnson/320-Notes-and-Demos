
//sometimes the 'this' keyword is mapped onto other objects
//specifically, when using event-listeners\\

//This is a function that sets up a timer
setTimeout(function(){}, 100); //takes callbackfunction we want to call(in this case is an anonymouse function, and time in milliseconds)

setTimeout(function(){console.log(this)}, 100);//whenever you are working with events the this keyword is mapped onto events specifically the event object
//the example up above won't map onto the global property


setTimeout(()=>{console.log(this)}, 100);//Arrow functions do not cause something to be recontextualized to event references
//Arrow functions do not change the contex of the 'this' thing

//practical example below
class Server {
		constructor()
		{
			this.port = 320;
			/*const sock = require('net').createServer({}, function(){
				console.log(this.port);//because I'm in an traditional function refers to the event object rather than the port
			});*/

			//In this below the this.port would refer to the servers port rather than the event
			const sock = require('net').createServer({}, ()=>{
				console.log(this.port);
			})
		}
}