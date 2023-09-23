
### Sept 14th:

Summary Upto this point:

- mostly have worked on the UI. 
- Have designed a numbering system for the board. 
- Implemented a smaller board (4x4) for testing, with UI for two players.
- Lost a few days of development, becaues I spent quite a bit of time on App School - learning about subscriptions, pokes and scries for basic agents.
    - I fell behind a week because I was thinking of things to do for the hackathon. I aim to have the App School Notes+homework started by Thursday, and finished by Sunday to keep up.
- Will continue on UI work, and learning an App School Tutorial (FlappyBird). This cointains relevent information for my backend.
- At the moment, the focus will be on the UI as I learn the backend stuff more.
- Will also need some rudimentary testing for my UI. Playwright.js for this?
- Might need Next/Express.js to make the FE <-> Gall requests a bit more simple to process.
- Overall development process: Focus on UI first, and switch more to backend and testing as the weeks go on.


#### Sept 16th:

1) I need to deal with the encoding issues:
    - I originally wanted to encode my board and walls with decimals, with (r,c) = r.c. However, I need a range of 0 -> 18 for each side. This means that 5.13 < 5.8 in terms of ordering of items, so this hack doesn't work.
    - Another flaw in this, is that floating points with a zero decimal get turned into integers by JS. So our float -> two ints function gets ugly.
- It looks like we will have to go back to GOF' string manipulation. So (r,c) = "r.c", and we split and cast to an int. 
    - Learning Point: Trying to be a code poet has wasted some time. 

2) Naming conventions:
    - variables: camelCase
    - classes: ClassName
    - object fields/properties:Our_Property
    - functions and class methods: our_function our_methods
    - CSS classes: our-css-class

3) Mapping out our Objects and Structures.

The 2 player game session will playout as follows:

- User 1 and 2 launch the apps on their desktops.
    => The Global State Object, the UI Board is set up.
- User 1 types in User 2's @p, and sends a request to play a game.
- User 2's Client accepts, and sends an ac.
    => The initiatior is set to Player 1
    => The acceptor is set to player two.

=> For each user:
    - The Player Object is set up. The Wall Object and Path Object is initialized.
    - The player queue is configured. P1 at the front.
    - The UI is initialized.
        - Player's pawn placed at the bottom. Opponent at the top.
        - Player UI Sidepanel (Player turn and wall count setup).
    - For Player 1: Move squares are highlighted.

- Once initialization is done, the play loop is started. It runs as follows:

- Everytime this loop is run, we have a response packet, and its the players turn


- If we have an update object from the Other player, then unpack it:
- access player whos turn it was.
    - update their data structure.

- Update their turn

- Player 1 is selected to take a turn.
    => Player Queue updated.
    => Player 1 Object stored to an access variable.

- UI event detection waits and runs...
    - We assume the player wants to move by default.
        => They may click on a square to move the pawn.
            - Rule checker routine is launched.
                - can player reach the square, is there something there in the way?
            - If move can be made, update UI
            - If illegal move, play a sound/throw an alert.
        => Player can toggle to wall mode, by clicking on their wall pieces.
            - UI now fixed into placing walls.
            => User can hit ESC to exit.
            => User must click on one wall segment.
            => User clicks on another wall segment, and rule checker invoked.
                => If successful, record state change. If not, throw an error.

- Move is now complete, communicate state change to other player.


4) So what Classes do we Need? How do they relate?

StateObject

Player Object

Wall_List Object

Rule Set Container
    - not necessary to be an object. It will just be an object with static methods for checking things.
    - will have access to global state object.

Things removed:
- we don't need a path list for each player. This is useless.
- we don't need to store which player placed which wall. Walls once placed, are not associated with a particular player.
    => Only need to update the wall count.

Things simplfied / changed:
- We just need a global wall_list. Don't need it for each player.
- Don't need a UI object. It just has to be aware
- Each player object stores the current position. Yes it is a pain to get each position for the rule set. 
    => Simplicity of maintaining state is worth the extra boilerplate to access the data. Just deal with it (⌐ ͡■ ͜ʖ ͡■)


(5)  Event Loop:

- The backend will be implemented last. For now, we need a main event loop to test our UI. 
- I will ignore the networking stuff, and the step-by-step rule checker. We need some basic play, for now.

- First, the game initializes. 
    - We make a gamestate object.
    => UI Change: In the walls box, we have an input for an @p, and a request button. 
    - We wait for the user to type an @p for us to send a request.
    - User types in an @p, and we make a network call.
- Next, our session setup occurs (communication between clients). This uses our network functionality.
- Once set up, we start the game. For simplicity, we will ignore network calls/packets, and simulate in our JS script.

- Use fake credentials to create Player 1 and 2.
    => UI Change: Remove @p box. 
    => UI Change: Setup two player boxes. 
    => UI Change:  Highlight Player 1 to start.

- Start event loop:
    - wait for player to move.
        - Default: Move Pawn mode.
        - Alternate: Select Wall, enter wall mode.
            - This mode can be cancelled by pressing the ESC key.
    - Once Move is made, update data-structures.
    - Update the board accordingly.
        => UI Change: Move pawn to new square (no restrictions for now!).
        => UI Change Add a wall to the board.

- Restart loop....call next_player and loop around again.


(6)  Separating our classes and code.

- I will avoid node.js imports for now, and just import things in the right order using the <script tag>. THe following separate files are needed:

- app.js:
    - holds our main event loop.
    - holds initilizer function.

- network.js:
    - makes all of our network requests, unpacks/packs them, talks to the backend thru ames, gall, etc...

- UIChange.js
    - just one big Class with static methods, that we call on to do UI Changes.

- RuleChecker.js
    - rule checking code goes here.

- Data Container.js: Contains all of our data structures we defined so far.


### September 21st:

- Time is ticking on. I have finished ASL3. Once ASL4 is complete, I will have all the tools to build my app.
- For today, I will focus on getting testing -threads running, and building a shell script to transfer files over to my desk.
- FlappyBird and other tutorials will be moved to another folder. My dev folder is getting messy!
- latest dev pill used to make a fake zod and nec. Backup folders made for quick recovery.
- backend folder stores a copy of our BE files, which are carted over to a ship's directory using the transport.sh script.
    - This is done, so if my zod crashes, I can easily recover it.
        - just pull the backup copy, and use transport.sh to recopy over the BE files.


### September 23rd:  Meeting with Sam:

- can I just drop by the hacker house whenever, or are there specific times. 
- what questions should I field to Sam v.s experts?
- next steps.
    - Our presented app must interface wiht Tlon's Landscape?
        - this is why react is necessary.
    - Flap method => can just use no frameworks, more raw JS and do it by hand.
    - I have to decide what I am doing (high road or low road). Got 9 days to get a large chunk of BE done.
        - ship of theseus => Use delta-> echo app, and build on that.
        - or the flap app.



- I figured out the img in div problem with jQeury: you can't name IDs starting with numbers. Changed the cell names accordingly.