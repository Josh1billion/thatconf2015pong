// ------------------
// global game state objects
// ------------------
var gameHasStarted		= false;
var serverWasFull		= false; // if we couldn't get into the game because there were already two players
var myPlayerIndex		= 0;
var playerCoordinates = [
	{
		x: 50,
		y: 150
	},
	{
		x: 500,
		y: 150
	}
];

var ballCoordinates = {
	x: 320,
	y: 240
};

// some constants, used when rendering
var playerDimensions = { width: 30, height: 70 };
var ballDimensions = { width: 5, height: 5 };

// ------------------
// keyboard control initialization
// ------------------
var upIsPressed			= false;
var downIsPressed		= false;

// initialize input handlers
$(window).keydown(function(e) {
	if (e.which == 38)
		upIsPressed = true;
	if (e.which == 40)
		downIsPressed = true;
});
$(window).keyup(function(e) {
	if (e.which == 38)
		upIsPressed = false;
	if (e.which == 40)
		downIsPressed = false;
});

// ------------------
// socket initialization and message handlers
// ------------------

// connection & game logic
var socket = io({reconnection: false});

socket.on('connect', function(data) {
	console.log('Connected to server.  Beginning each frame');
	setInterval(executeFrame, 33); // start rendering every frame
});

socket.on('startGame', function(data) {
	gameHasStarted = true;
});

// the server is telling us which player we are: 0 (left) or 1 (right)
socket.on('identity', function(data) {
	myPlayerIndex = data.playerIndex;
});

// if the server tells us it's full when trying to join
socket.on('serverFull', function(data) {
	serverWasFull = true;
	gameHasStarted = false;
});

// when the server tells us the coordinates for all players + objects
socket.on('coordinates', function(data) {
	playerCoordinates = data.playerCoordinates; // array
	ballCoordinates = data.ballCoordinates; // object
});

// ------------------
// game logic & canvas/rendering-related code
// ------------------

// a function that gets called every frame (every 33 ms).  handles logic, and renders game objects to the HTML5 canvas
var executeFrame = function() {
	tickFrame();
	renderFrame();
}

// client-side game logic happens here, once every frame.  mainly just checking for keypresses and sending messages to the server
var tickFrame = function() {
	if (upIsPressed) {
		var requestedCoordinates = { x: playerCoordinates[myPlayerIndex].x, y: playerCoordinates[myPlayerIndex].y - 4 };
		socket.emit('moveRequest', requestedCoordinates);
	}
	if (downIsPressed) {
		var requestedCoordinates = { x: playerCoordinates[myPlayerIndex].x, y: playerCoordinates[myPlayerIndex].y + 4 };
		socket.emit('moveRequest', requestedCoordinates);
	}

};

// renders the game objects
var renderFrame = function() {
	var canv = document.getElementById('canv');
	var context = canv.getContext('2d');

	// draw background, which means just drawing a big rectangle
	context.fillStyle = '#334d93'; // dark blue
	context.rect(0, 0, 640, 480); // canvas x,y coordinates, and width/height
	context.fill();

	// draw "server was full" message if we couldn't join the game
	if (serverWasFull) {
		context.fillStyle = '#cccccc'; // light gray
		context.font = '20px bold Arial';
		context.fillText('The server was full, with two players already playing', 150, 200);
	}
	// draw "waiting for more players" message if the game hasn't started yet
	else if (!gameHasStarted) {
		context.fillStyle = '#cccccc'; // light gray
		context.font = '20px bold Arial';
		context.fillText('Waiting for one more player to connect...', 150, 200);
	}
	else {
		// draw both players
		for (var i = 0; i < playerCoordinates.length; i++) {
		//	context.rect(); // canvas x,y coordinates, and width/height
			context.fillStyle = '#cccccc'; // light gray
			context.fillRect(playerCoordinates[i].x, playerCoordinates[i].y, playerDimensions.width, playerDimensions.height);
		}

		// draw the ball
		context.fillStyle = '#cccccc'; // light gray
		context.fillRect(ballCoordinates.x, ballCoordinates.y, ballDimensions.width, ballDimensions.height);
	}

}

