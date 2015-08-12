#Installing node.js
[Nodejs.org](https://nodejs.org/) has easy installation instructions.  Note that Node.js installations come with npm installed by default, so you won't need to install that separately.


#Installing the sample code

Just checkout the repository, and you're good to go.  Slides are in the root folder, and the code is in the **pong** folder.

I've included the node_modules directory, so you won't need to run **npm install** like you would for most projects.

Note that you'd generally *not* want to publish the **node_modules** directory to your repository, because it contains all of your dependencies, which tend to have many files, and so it will cause checkouts to be very slow (not to mention making updating those dependencies more difficult).  It's better to keep that directory out of your repository, and just tell your users to run **npm install**, which will download all of the dependencies that are listed in **package.json**.

#Running the sample code

Open a command line and navigate to the *pong* folder, then type **node app.js**.  You can also use **nodemon app.js** to run it with Nodemon instead (after you've installed it with **npm install -g nodemon**), which will cause it to restart the server upon any source code changes.  The app should say "Listening on port 80", and then you can open two web browsers to [http://localhost](http://localhost) to try out the game.

The game is intentionally simple, so the server doesn't handle multiple game sessions, nor does it reset its state when the players disconnect.  If you play a game of pong, you'll have to restart the server in order to play another one.
