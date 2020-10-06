const Server = require('./Server.js').Server;//reference the variable in server.js and set it equal to Server
const PacketBuilder = require("./packet-build.js").PacketBuilder;






const Game = {
	whoseTurn:1,
	whoHasWon: 0,
	board: [
		[0,0,0],
		[0,0,0],
		[0,0,0],
	],

	clientX:null,
	clientO:null,
	PlayMove(client, x, y)
	{
		//ignor moves after game has ended
		if(this.whoHasWon > 0) return;
		

		//ignore everone but clientX on clientX's turn
		if(this.whoseTurn == 1 && client != this.clientX) return;
		if(this.whoseTurn == 2 && client != this.clientO) return;
		if(x < 0) return;//ignore moves off the board
		if(y < 0) return;//ignore moves off the board
		if(y >= this.board.length) return;
		if(x >= this.board[y].length) return;//ignore moves off the board //4:27 is when nick explained this
		if(this.board[y][x] > 0) return; //ignore moves on taken spaces
		this.board[y][x] = this.whoseTurn;//sets board state

		this.whoseTurn = (this.whoseTurn == 1) ? 2 : 1;//TOggles the turn
		this.checkStateAndUpdate();

	},
	checkStateAndUpdate(){
		//TODO: look for game over
		
		const packet = PacketBuilder.update(this);
		Server.broadcastPacket(packet);
	}
};

Server.start(Game);