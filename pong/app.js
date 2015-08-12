// create the server objects
var express		= require('express')
var app			= express();
var http		= require('http').Server(app);
var io			= require('socket.io')(http);

// tell Express which middleware to use.  just the built-in "static" middleware, in the case of this app
app.use(express.static('public')); // all files in 'public' will be accessible

// global game variables
var numberOfPlayers = 0;

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
	x: 200,
	y: 200
};

var ballVelocity = {
	x: 3,
	y: 3
};

// some constants, used when performing collision logic
var playerDimensions = { width: 30, height: 70 };
var ballDimensions = { width: 5, height: 5 };

// returns a boolean indicating whether there's a collision between two rectangles
function collisionDetected(rect1, rect2) {

	var collision = !(rect2.x > rect1.x + rect1.width
		|| rect2.x + rect2.width < rect1.x
		|| rect2.y > rect1.y + rect1.height
		|| rect2.y + rect2.height < rect1.y);

	return collision;
}

// function that moves the ball every frame (every 16 ms)
function moveBall() {
	// change ball position according to velocity
	ballCoordinates.x += ballVelocity.x;
	ballCoordinates.y += ballVelocity.y;

	// check for the ball colliding with the bottom or top of the screen
	if (ballCoordinates.y + ballDimensions.height >= 480 || ballCoordinates.y <= 0) {
		ballVelocity.y *= -1;
	}

	// check for the ball colliding with the right of the screen (player index 0 scores!)
	if (ballCoordinates.x + ballDimensions.width >= 640) {
		resetBallPosition();
		ballVelocity.x *= -1;
		// as an exercise, you could increase the score for player 0 here.  be sure to emit a message to the clients letting them know the new score
	}

	// check for the ball colliding with the left of the screen (player index 1 scores!)
	if (ballCoordinates.x <= 0) {
		resetBallPosition();
		ballVelocity.x *= -1;
		// as an exercise, you could increase the score for player 1 here.  be sure to emit a message to the clients letting them know the new score
	}

	// check for the ball colliding with either player
	for (var i = 0; i < playerCoordinates.length; i++) {

		// build rectangles to use for collision detection...
		var playerRect = {
			x:		playerCoordinates[i].x,
			y:		playerCoordinates[i].y,
			width:	playerDimensions.width,
			height:	playerDimensions.height
		};
		var ballRect = {
			x:		ballCoordinates.x,
			y:		ballCoordinates.y,
			width:	ballDimensions.width,
			height:	ballDimensions.height
		};

		if (collisionDetected(playerRect, ballRect)) {
			ballVelocity.x *= -1;
		}
	}

	// notify *all* connected clients of all game coordinates (even player coordinates, though this isn't necessary)
	io.emit('coordinates', { playerCoordinates: playerCoordinates, ballCoordinates: ballCoordinates });
}

// resets the ball's position (in case a player scored a point)
function resetBallPosition() {
	ballCoordinates = {
		x: 200,
		y: 200
	};
}

// create the socket.io handlers
io.on('connect', function(socket) {

	// if there are already two players connected, tell the user that the server is full
	if (numberOfPlayers == 2) {
		socket.emit('serverFull', {});
		return;
	}

	var playerIndex = numberOfPlayers++;

	// right upon connecting, tell the player whether they're the left or right player (0 or 1)
	socket.emit('identity', { playerIndex: playerIndex });

	// when the player requests to be moved...
	socket.on('moveRequest', function(data) {
		playerCoordinates[playerIndex].x = data.x;
		playerCoordinates[playerIndex].y = data.y;
	});

	// if this is the second player connecting, let's start the game
	if (numberOfPlayers == 2) {
		io.emit('startGame', {}); // let all connected players know that the game has started
		var tickInterval = setInterval(function() {
			moveBall();
		}, 16);
	}

});

// start listening on the port
http.listen(80, function() {
	console.log('Listening on port 80');
});
