# Space Invaders

![Logo](https://i.ytimg.com/vi/k9oyDTR0EwQ/maxresdefault.jpg "Space Invaders")

## Rules of the Game
Space Invaders is the classic single-player arcade game introduced in 1978. The objective of my version is to make it through 3 levels of increasing difficulty while avoiding getting hit by enemy bullets and preventing the enemies from reaching the bottom of the screen. Difficulty between levels increases by having enemies become faster and take more hits in order to die.

## Controls
Players use the left and right arrow keys to move their ship and the spacebar to shoot. When prompted, the player can press the Enter key to restart the game.

## Technologies
HTML5, CSS, and JavaScript were used to create the website. Canvas was used to render the graphics and run the game.

## Approach/Process
After creating the wireframe, I started just playing around with Canvas and piecing together how to accomplish the features listed in my user stories. I first learned how to draw on the canvas and create a figure. Drawing the figure turned to figuring out how to move it around, which turned to figuring out how to move it around with keydown events, etc. So I just tried to learn how to accomplish one of the user stories and build off the knowledge for the following ones I approached.

To help with the creation of the objects needed for the game and make the game easier to scale, I used classes from ES6 to make the game more object oriented, storing properties like the coordinates, width, height, along with functions to draw and update the objects on the canvas. This, along with using functions to create new levels that draw the enemies and set the enemy speeds, makes it easy for me to not only create new characters/enemies, but also easily add levels.

After finishing the basics of the game that followed the user stories, I created a list of features that I thought would make the game more interesting and more fleshed out, such as a score counter, multiple lives, difficulty adjustments, sprites and animations, background animations, sound effects, and more.

## Wireframe
![wireframeImg](https://github.com/yojoecool/SpaceInvaders/blob/master/docs/wireframe.png "Wireframe")

## Biggest challenges and wins
The biggest challenge was probably learning Canvas in the first place since I had never used anything like that before. Along with learning Canvas, making sure I kept my scope realistic and avoiding feature creep given the limited time to work on the project was also a challenge. 

My biggest win was getting things animated smoothly with the controls being responsive. I didn't originally plan to use the animation loop I ended up with to constantly redraw the image on the screen, but deciding to go in that direction made things a lot smoother.

## Bugs
None that I know of

## Future Features
More levels, bosses, high scores, touch-screen controls

## User Stories
https://trello.com/b/sCXykRc4/space-invaders
