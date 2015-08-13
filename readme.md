#Installing node.js
[Nodejs.org](https://nodejs.org/) has easy installation instructions.  Note that Node.js installations come with npm installed by default, so you won't need to install that separately.


#Installing the sample code

Just checkout the repository, and you're good to go.  Slides are in the root folder, and the code is in the **pong** folder.

I've included the node_modules directory, so you won't need to run **npm install** like you would for most projects.

Note that you'd generally *not* want to publish the **node_modules** directory to your repository, because it contains all of your dependencies, which tend to have many files, and so it will cause checkouts to be very slow (not to mention making updating those dependencies more difficult).  It's better to keep that directory out of your repository, and just tell your users to run **npm install**, which will download all of the dependencies that are listed in **package.json**.

#Running the sample code

Open a command line and navigate to the *pong* folder, then type **node app.js**.  You can also use **nodemon app.js** to run it with Nodemon instead (after you've installed it with **npm install -g nodemon**), which will cause it to restart the server upon any source code changes.  The app should say "Listening on port 80", and then you can open two web browsers to [http://localhost](http://localhost) to try out the game.

The game is intentionally simple, so the server doesn't handle multiple game sessions, nor does it reset its state when the players disconnect.  If you play a game of pong, you'll have to restart the server in order to play another one.

#Additional considerations not mentioned in talk/slides

Due to time/scope constraints, I left the following out of the talk intentionally, but these are some important concepts to note if you want to go forward with building games with Node.js/socket.io.

##Use requestAnimationFrame instead of setInterval()

On the client, using setInterval() to execute a function every second isn't really a good idea.  I used it in the talk because it's familiar to every JavaScript developer, but there's a drop-in alternative that offers better performance and won't run into issues such as the application falling behind and trying to play catch-up.

You basically just need to pass your per-frame function to window.requestAnimationFrame().  But since browsers haven't always been consistent in their implementations of it, using a polyfill here is a good idea.  Paul Irish has [a robust polyfill and example on his blog](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/) that you should use.

##Modularizing your Node.js code

As you've probably guessed, putting all of your server code in one file is going to make things more difficult to maintain.  A better approach is to modularize the building blocks of your code into your own Node.js modules, and require() them in, similar to how you would require() in somebody else's package that you installed with npm.

##Routes and templating

I mentioned in the talk that part of the reason for adding Express as a dependency (in addition to using it for serving static files) is that we might want to use some of its other features as the scope of the app expands.

Among these, Express offers easy use of [routing](http://expressjs.com/guide/routing.html) and [templating](http://expressjs.com/guide/using-template-engines.html).
