
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

- how do I test my app with real ships? Just install on Tlon's Grid?
- can I just poke an external ship via Dojo? I have only seen poke notation for apps.
- how do we test for a ship being on the network? Send scries to our Ames vane of our running ship, and it does it?


- I figured out the img in div problem with jQeury: you can't name IDs starting with numbers. Changed the cell names accordingly.


Designing the Interaction between two ships:

- assumptions: both players store a copy of the game on their ships. There is only one game. 
- Let our two ships be called P1 and P2. 

A Typical Interaction:

- P1 loads the %Quoridor Application.
- P1 types in an @p of another ship. 
    - The user interface grabs the ship name, and then sends it back to our back-end.
        -Q how do we send a request to the backend?
- P1 BE recieves the @p shipname for P2. [we assume P2 is running the App].
    - P1 must formulate a request to P2, to initiate a session.
- P1 must send a subscribe request to P2.
    -P1 sends additional data: It is player 1.
- P2 gets a subscription
        - P2 checks to see if there is a saved game. If so, it is deleted.
        - P2 responds with an %init ack for the request. If a game was deleted, this is indicated in our %init ack.
- P2 sends a subscription. Indicating that it is the 2nd player.
        - P1 checks to see if there is a saved game. If so, it is deleted.
        - P1 responds with an %init ack for the request. If a game was deleted, this is indicated in our %init ack.
- P1 sends an %init ack for the subscription.
    - P2 is now ready, and waiting for P1s move (?)
- On the FE P1 makes a move.
    - FE Javascript must update.
    - This is encoded by JS, and sent as a POKE to the BE.
        %marks: %move and %wall
- P1 BE recieves the %move poke with small amount of data.
    - P1 BE writes the move to our bowl, and saves the bowl to a file (just overwrite or append).
- P1 BE sends a poke with a %move to P2.
    - P2 unpacks the move, sees that it is P1 and what the move actually is.
    - P2 stores the move in the bowl, and writes it to clay.
- P2 sends a response to the FE, telling the user that it is now their turn. The move player 1 took is also sent along, and updated on their screen.
    - P2 FE updates P1s move. It indicates that P2 must make a move.
- P2 makes a move on screen.
    - again, P2 FE sends a poke to P2 Backend, with the move.
    - P2 BE recieves poke, adds move to bowl, writes to file.
    - P2 now sends a poke with move to P1.
    - P1 processes the move, and sends a poke to FE.
- The cycle continues.


What can be gleaned from this sample interaction, above? A MI (Minimum Implementation).
    - initiation needs to be setup. Can a dual subscription
    - don't need to worry about writing to clay. Lets just store a move set in each agents bowl.
    - structures in /sur:
        - %position:  [%position @cd @cd] [%position 4 2]
        - %wall [%wall [%position ..] [%position ..]]
    - pokes with marks:
        - positions and walls encoded with 
        [%move <player number> <new position>]
        [%wall <player number> <wall position>]
        %win - just a simple flag
        %terminate - ""

- How to start: Ship of theseus method on the %echo app. Start transforming it in the %Quoridor app that you wanted.


## Sept 24th

- just wasted 3 hours trying to get echo -> quorridor working.

- Q: If our current echo (from ASL4 works), why can't we just copy echo, and rename everything quoridor in all of the directories and files. In theory, it should work!
    - This allows me to generate infinite ready to go folders.

    => Result. We still get /mar/json/hoon build errors. The file looks fine.
    => Either the outside desk is fucked, or our zod is fucked.
    => The development zod is a strange looking beast.

- Now, I will try copying the echo files from the working zod, BACK to the outer echo folder. And then copying that and transforming it to a zod.

=> It still failed! I have noticed a front end error, however.

"index-3c4df9b2.js:41 gall: poke cast fail :quoridor [a=%json b=%quoridor-action]"

Something is weirdly formatted. We need to rebuild the app again...This time focusing on the UI, and doing a new npm rebuild

=> removing the shit code did nothing. What have I concluded:

- I need to build my code FROM SCRATCH, carefully. You cant just text substitute an intermediate folder from some other project.

- I made a quoridor-starter folder, and placed it for safekeeping in my zod_storage. I am NEVER going through that again.

- Now that I have a working project, it is time to work on some basics:
- A sur file with all our basic structures (walls, moves, termination / win signals)


#Sept 25th:

- Still working on a basic FE -> mar -> app pipeline, stuck on gall compilation.
- Found the %chess app github: https://github.com/thecommons-urbit/chess

- In the mean time, I need to design some structures for my app, and test them by hand.

- Basic Structures:
    - Position [r=@ud c=@ud]  : both numbers must be even.
    - Wall Position [position1 position2] :one number must be odd.

- Player Data:
    - Player Name  @p
    - Player Number  @ud
    - Number of Walls Left [@ud] : from 0 to 8
    - Current Position [position]

- Game State Data:
    - Player list: [player structures]: 1 to 4 allowed
    - 
    - structures in /sur
        - %position:  [%position @cd @cd] [%position 4 2]
        - %wall [%wall [%position ..] [%position ..]]
    - pokes with marks:
        - positions and walls encoded with 
        [%move <player number> <new position>]
        [%wall <player number> <wall position>]
        %win - just a simple flag
        %terminate - ""

- From the above, a basic /sur file was created. Now I need to test it.
- need to make a generator, that takes an input and can cast with our sur file.
- is this possible?

- I figured it out: =mygen -build-file /=/quoridor/=/gen/testsur2/hoon on dojo cmd line.

- Ford Imports:
/-  import from /sur
/+ import from /lib
