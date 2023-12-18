
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

- you just write urbitID names ~nodsup-halnux. You don't need to express them as a cord!

- From Jack:
    - for agents, marks are imported automatically.
    - the /- gets us our sur files.
    - the sig at the end makes a reversed unit. Not sure why this is necessary?


### September 26th:

- Focus for today:
    - Get the data pipeline basically fleshed out.  App.js -> Eyre -> Mark -> app.hoon and all the way back.
    - start integrating jQuery into our node.js.
    - App School
    - Need to basically get HW4 done.


- My modified echo app is too fucked up now. It has all sorts of bugs. Gotta pull echo out of zod_storage and start again.
- Really, there are three things I need to do to progress.
    - read though echo.app again. I don't think I fully grasped it. [X]
    - Restart your echo -> quoridor app. Just save your /sur file, and remove all the crap.

    - The flappy Bird app has an equally simple mark/sur structure. Read through it. 
        => This i will do after I get the data pipeline and front end working.
        => Flappy Bird gives us Pals integration, and horizonal communication. This is a **bonus at the end, not a goal now**.

- what does update.hoon do?
  ::frond: produce a $json formatted object (just a tagged structure) from a key value pair
  ::pairs: Given a list of keys and values, produce a larger object.
  ::scot just converts a type from one to another.
  ++  json
    =,  enjs:format  ::we go from native -> $json. Import namespace.
    ^-  ^json  ::what does ^json do??
    ?-    -.upd
     :: make a key value %o cell. first cell is pop, second is a ship name of string type.
     ::[%o p=[n=[p='pop' q=[%s p='~zod']] l=~ r=~]] -->  {pop: "~someship"}
      %pop   (frond 'pop' s+(scot %p target.upd))  
      :: make a KV %o cell, first cell init, second is a list of values. ++turn applies numb to our list.
      :: would not compile (?) ... -> {init: [1,2,3,4,5,6...]}
      %init  (frond 'init' a+(turn values.upd numb))
      %move  (frond 'move' )
      ::  again a cell, push at front, and then another cell with a target and value pair nested inside.
      :: [ %o p [   n [ p='push' q [ %o p [ n=[p='target' q=[%s p='~zod']] l=~ r=[n=[p='value' q=[%n p=~.5]] l={} r={}] ]]]
      :: --> {push: {target:"~zod", value=5}}
      %push  %+  frond  'push'
             %-  pairs
             :~  ['target' s+(scot %p target.upd)]
                 ['value' (numb value.upd)]
              ==
    ==
  --

- I have the quoridor app running by this point. It very basically works. Now, perhaps I can finally build.

### Sept 27th:

- Finished HW4 last night. THat is a relief. React isn't quite a scary as I remember it to be. Perhaps I just had bad sources, or was retarted in the past.
- I got the app working. Next Steps:

- Fulfill the move and wall moves.
    - flesh out the data passing pipeline, basic test
    - start adjusting the bowl and state.
    - state revisioning, or just |nuke?
        => Nuke it. Easier for now, and there will be **many* state changes over the coming weeks.


-no need to have nested updates from native -> $json notation. The chess app gives flat single cell updates. I will do the same.
    - nested fronds and pairs will be a debugging PITA.

Sample Structures Transmitted: For Push:
app.jsx { push: { target:`~${window.ship}`, value:val } }
at quoridor.app:    [%push target=~zod value=7]
at update.hooon:    [%push target=~zod value=8]

So they look the same. This flattened native strucutre is what we expect at update.

- Conceptual Error: In action.hoon, I was trying to mach a strucutre:
-  [%move (ot ~[target+(se %p) pos+(ot ~[position])])] 
-  [%move (ot ~[target+(se %p) pos+(ot ~[row+ni col+ni])])] 
- but that doesn't work. We import a sur file but we don't match the structure. Instead, our formatter just dives into our input structure and
  looks for fields. we can actually change the shape of our $json structure. We don't need to keep the same rigid shape throughout.
  - to be more explicit: you can just drop tags, fields, whatever. Hoon doesn't care.

- Example of The de-js to $json structure. It looks like:
raw json form: {move: { target:~zod, pos: {row:2, col:2}}
$json form:
[ %o p [   n [ p='move' q [ %o p [ n=[p='target' q=[%s p='~zod']] l=~ r [   n
    [ p='pos' q [ %o p [ n=[p='row' q=[%n p=~.2]] l=~ r=[n=[p='col' q=[%n p=~.2]] l={} r={}]]]] l={} r={}]]]] l=~ r=~]]

- i wanted a nested update strucutre, but frond doesnt work this way. Made it flat instad.

      %wall  ~&  "our move update"  ~&  upd
          %+  frond  'wall'
            %-  pairs
            :~  ['target' s+(scot %p target.upd)]
            ==
            %+  frond  'pos1'
              %-  pairs
              :~  ['row' (numb row.pos1.upd)]
                  ['col' (numb col.pos1.upd)]
               ==
            %+  frond  'pos2'
              %-  pairs
              :~  ['row' (numb row.pos2.upd)]
                  ['col' (numb col.pos2.upd)]
               ==

- looks like I can't put action structures on multiple lines either. Must all be on one line.

- what variables should be in our bowl state?
- players list
    - player types


### September 28TH:

- reminded myself about states.

- Need to start working on the state processing of my Quoridor app. Requirements:
    - for now, just nuke and make a new state.
    - State of the app must hold the following:
        - Players List
            => Just program it with the FE, and copy it into both slots.
        - turn number.

- you don't need to produce a card at the end of a poke branch. Consider:

++  on-poke
  |=  [=mark =vase]
  ~&  >  state=state
  ~&  got-poked-with-data=mark
  =.  state  +(state)
  `this
::

- got a PUT: 400 error from FE, after nuking and reloading app. 
    => Zod needs to be reloaded. 400 is a bad request error. It SHOULD subscribe just fine
    - reloading zod, and npm run bulid seemingly fixes this.

- understanding this(...) notation:
    - this is SS for centis - which resolves wings of a tree and alters them.
    - Tall form example: 
    - %=  this
              ::  reset potential states on draw
              potential-states  (~(put by potential-states) game-id.action ~)

    - Another Example (SS:)
```
=foo [a=1 b=2 c=3]
foo(a 5,b 10,c 15)
```
- use comma SS notation to alter our state. this() refers to a  wing, and the stuff inside the parens are the things in the wing we change.
    - its all binary trees in the end, Jake.
- our player structure should already be properly formed by action.hoon - no need to do complicated changes in quoridor.hoon.

- what does " potential-states  (~(put by potential-states) game-id.action ~)" mean??
%-  %~  put  by  <map>  [key value pair]
%- calls a one argument gate
%~ evaluates the arm of a door.

- it looks like I am having conceptual difficulties with maps. Back to the Hoon School notes...

(~(put by potential-states) game-id.action)
- outer parens are a gate call with %-
~() refers to %~
    - put is our arm
    - by is our door
    - potential-states is our sample
    - game-id.action is our input - what we want to change.

- designing state incrementally is poor development, and I am tired of small scale tinkering. This is a necessary milestone, and it needs to be solved **now**.

- It is time to design our basic state, and initialization of our agents.

Basic Agent State:

+$  state-0
  $:  [%0 values=(list @)]
      [%1 pmap=playermap]
      [%2 tcount=@ud]
  ==


- Values is legacy stuff, just leave it for now
- pmap is a player map. All player data is stored in player objects.
- turn count is obv.
- for this demo, we have one BE agent, and two FE agents.
- first the FE connects and subscribes, we send the current state object of the app back
    => We should not alter the state with a subscribe (!)
        - so a values list, a player list, and a turn count. is send back => (This will signal intial state later)
    - Each FE agent has a button that initializes the player. P1 presses the button.
        - this consists of a player name, number of walls remaining and a target in our JSON object
            => We don't know what the player number is yet. Let the agent decide what it is.
        - this gets conveted to an action %register, and is converted to a head tagged tuple.
        - we switch in the ++on-poke arm with our action.
            BRANCH: first we check to see if the player map is empty.
            YES:  
                - construct a player tuple: 
                - set player number to 1.
                - insert into dictionary. 
                - update state, and send a card to FE.
            NO: 
                - construct a player tuple:
                - set player number to two
                - insert into dictionary
                - update state, and send a card to FE
        
        - After both player instances have pressed the button, we are technically ready to play. We should be able to send moves.
        - on %move:
            - extract player tuple.
            - change position. 
            - reinsert player object.
            - send a response to FE
        - on wall:
            - same as above, but a bit more fiddly.

- lost over an hour because I didn't update the sur file fml.

### September 29th:

- Basic code for player init is ready. Need to double check structures and maps. Will make a simple core/generator and play around with them.

- define a structure:  
=bankaccount $:  $=  name  @p  $=  num  @ud  ==
^-  bankaccount  [name=~zod num=5]

Note that you can use the mold to **pin the faces**, you don't have to do it!
^-  bankaccount  [~zod 5]
>> [name=~zod, num=5]

Syntax forms:
We can sugar the  $= (which pins faces), but we can't sugar the $:
=bankaccount $:  name=@p  num=@ud  ==
^-  bankaccount  [~zod 5]

However, we need to enter structure mode with a comma if we make it full SS:

=bankaccount ,[name=@p num=@ud]
`bankaccount`[~fes 256]

If you **forget the comma**, you get:  -find.$ error. Your mold gets run as a gate.

**Playing around with Maps:**
- upgraded my testsur.hoon file to run gates with map operations inside. I am more comfortable now.




- changing state:
- recall this(state  awing bexpr   cwing  dexpr) is calling centis %= gate. We take our state object (which is just a binary tree),
- and mutate the cells. Our agent arm them returns the mutated state with the list of cards.



### Sept 30th:  

- I am coming up to the end of my development week. I have done a lot of experimentation, and learned a lot about the FE-BE pipeline for gall apps.
- Its time to achieve a limited-functionality milestone, and get everything cleaned up.
    - I need my front end basic design nailed down.
    - My FE code needs to be integrated into react and running.
    - A basic initialization session needs coded, and moves on the screen need to be animated.

- I am going to work from the FE to the BE, linearly. Its easier, as I get to start with UI changes and thats a nice start.

- FE Design:
    - css must be changed.
    - I want my Quoridor app to fit in 50% of the screen, centered. This helps with cellphone displays in the future.
    - It also looks better
    - got it basically working. Some -negative margin hacks to get things lined up. And the @p box doesn't compress when we make it hidden.
    - it is functional and looks better than it did, will leave for now.

- Integrating with React:
    - trying to get live-server working casues a lot of erors.
        - this is because our module paths are relative to %docket, and %docket generates missing files when we upload via the glob.
        - so I have to glob everytime to check if things work. This will slow down testing :( .

        - CSS and HTML were just pasted into index.css and app.html. No issues with this.

    - First Problem: Assets (images) are not found, because of the %docket magic in the background. When I run npm build, how do I get it 
    to include the images in the dist folder, and map the right path??
    - this was solved by just importing images directly into app.jsx, and plugging them into src with {variables}
        - https://create-react-app.dev/docs/adding-images-fonts-and-files/
    - font issues were solved by using the /public/ folder trick. css is importd in main.jsx.
        - https://create-react-app.dev/docs/using-the-public-folder/
    - Importing JQuery and testing it out.
        - just import $ jQuery, and throw functions in export function app() of app.jsx. IT works.
        - importing a javascript file.
            - import * as appjs from './public/js/app.js'

    - so that all works...time to put all the JS in our react app, and finish off the UI.
    - first test the old functionality. 
        - was going to import over a namespace, but files call eachother and are united in app.jsx...everything is in global namespace for now.
        -quite a few issues here. Javascript
        - dev strategy: just use live-server and do dev work in the old html/jquery files. and copy the code over.
            => trying to run build and glob will eat up too much time.


### October 1st:

- stated using chatGPT to assist in coding. It gave good advice on library imports, and jQuery hacks.
- For my UI, my initialization sequence breaks my model of not accessing player objects directly. I will try to maintain this rule for the main turn loop, and leave init as a special case (where it is allowed).

### October 7th:

- Finished the wall placement event calls.
- Cleaned up code a lot.
    - more commenting for functions.
    - separating and grouping sets of functions, between UI and APP.js
- Used chatGPT to generate a help box and console box for the application - took the code and integrated it into the UI.
- I now log events to the application console. Wall lists and Player objects are printed to the inspection console after every move, still.
- Wall selection animaitons have been simplified:  There is no on-hover highlight. You just click on a wall segment and it turns orange.
- Critical mistakes:
    - mixed up "css" and "class" attributes, could not get highlights to work for a long time.
    - wasn't aware of the .toggleClass() feature jQuery has. This makes css class swapping (for hidden/visibility) much simpler.


### October 8th:

- The UI now basically functions: Our turn loops don't crash, and we can move/place a wall, inspect an event console, and click on a chat box. Wall indicators also
    decrease when a player places a wall.
        - There is still no rule checking, however.

- (!) Now all of the JS/HTML/CSS files must be integrated into our React Front end (!).

- Recall from before, the following imports syntax needs to be used:  `import {fun1, fun2 ...} from './js/whatever/js'` in order to get our functions to be recognized by the react app. We can't do `import './dir/whatever'`, as this gives us void (0) errors on runtime in the browser.

- If I remember correctly, I made changes to the backend without commiting. I will have to sort all this out first, and double check...

- So far my quorridor app is running OK. I Have not recommited changs. Best to just integrate the JS first, before we play with backend...

#### Steps to Integrate our jQuery Front-ENd:

1) Paste HTML into app.js render loop. Remove all <script> tags at the bottom (will use ESM imports instead).
    - remove any comments in the file, close the </input> tag, etc.
2) Copy over the two CSS files. Place both files into the index.css file (for now).
    - keep the tailwind stuff and /font0family tag at the top (it has the proper /public path).

**At this point, npm run build and test the rendering in the browser.**

3) All of the javascript files now need to be copied over. For each file, do so, and prepend each function/class name with the keyword "export".
    - If new functions have been added, add them to the  `import {} as ...` statements at the top of app.jsx
    - Exceptions:
        - in ui.js, don't export Pawn Images (these are imported by app.jsx directly)
        - dont need testscripts.js or network.js....yet.
        - Class state -> GameState, as it clashes with a State Object with React.
        - class Player -> GamePlayer, as there is an unforseen namespace error with React (I can't find it!)
        - class WallList also struggles...changed to Wall_List
        - remove initializeGame() from the JS file.

- at this point I am stuck, because GameState is not recognized (a class in datamodel.js). The module is imported correctly, there are no issues.
- Changes:
    - Slammed everything into one javascript file (megafile.js)
    - just did one big import {...} from megafile.
    - imported $ from 'jquery' in app.jsx, and my megafile together.

    - and now my code works!

Errors Encountered on Build:

"input is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
    =>  OUr input tag must be an empty one!



### October 11th:

- HW6 is under control for now.  It is time to push ahead for devleopment.
- Last time, I got my jQuery integrated into the react app.

- The next step is to remove the %echo behaviours from the app, and start connecting Quoridor to our backend.

- We need a basic state:
    - That stores:
        - A walllist
        - A turn count
        - Player Objects
            - player positions, number of walls left, etc...

Front End side: Network.js code needs to be fleshed out.
    - **one app instance** will run both players (for now).
    - for now, all network code can stay above the react render() loop.
    - fix annoying CSS issue (so I can see the game).
    - Hookup:
        - Initialization packet (just hardcode the two names and send it off.).
        - ON end of player move: send a move.
        - On end of wall placement: send a wall.


- After all this is implemented, I will subtract away the %echo code and clean up the QD front end.

- I have actually been a bit confused the entire time. Our %echo app uses %give fact and subscription wires to send back all of our information to our app.
- When we send a poke, we get data back based on the init subscription we setup on application load.
- How do we send a poke ack and data back, without the wire?
    - pokes can be rerouted to other arms or apps, but don't generally have their own return strucures. We have the poke-ack with a tang and cage (error stack trace)
    => A poke is a "one off message". So you should not think about returning complex data using the poke structure.

Note the following:

+$  gift
  $%  [%fact paths=(list path) =cage]
      [%kick paths=(list path) ship=(unit ship)]
      [%watch-ack p=(unit tang)]
      [%poke-ack p=(unit tang)]
  ==

We can't really give a %gift %watch-ack - as its datafield is for an error stack trace. if this is null, its a positve ack (by default).

Strangely, the http-api for the node package does allow us to have an on success and on failure function for pokes
    => This does not have any explicit arguments, and on success even assumes an empty ack. Don't rely on this!

So before I start all of the above, I need a better mechanism for getting data back from the %Quoridor agent. We have to use subscribes, so we must
use react state to do this. 

How is a move made?
1) Player makes a move, we hit the end of the player_move() loop.
2) We make a call using http.api to send a poke with our player info and move. 
3) As per usual, our app processes the move, and sends a %fact with a response. This gets sent across our return path, back to the FE.
4) our handleUpdate function is then called. We store our state for the user.
5) We then must continue our loop. This will require await/async keywords, to handle promises.


### September 12th 2023:

-  First steps:
    -  throw all the event loop functions into the file [X]
    -  fix the awful CSS...[X]
    Answer: Everything needs to be pasted in. They are separate namespaces.
    - import initializeGame => it asks where GameState is (its in megafile!)
    => It is too messy to just paste megafile into the App() container. That is a shitshow.

- The documentation for globbing and docket files is pretty simple...we can probably adjust rollup to deal with namespacing issues.

- using react with urbit. We used a template folder...? create-urbit app??

At this point, I either rewrite all my code in React (using the Tic-Tac-Toe tutorial as a guide.) Or...


### September 14th:

- So I was able to get my code working in the end. The following things worked:
    - started simple (didn't go into Rollup.js/Vite).
    - changed export var gameState to just be a declaration.
    - placed my two init() funcitons back in megafile.js

    - Basically, I didn't import gameState (global variable), and when I tried to change it with the init() code that I pasted into App(){}, it caused Reference and Clobbering errors. The changes above fixed it.

- We are still left with the following issue:  Our changes from the App are communicated from subscriber line, and this code is located in App.js(). We need to read our reducer store to update our Quoridor clients gamestate. Can it be done?

- We either have a namespace issue or not. Can we call a trivial function from App(), in a megafile.js function.
    => IN theory, everything should be imported, hoisted and rectified before the function runs, so there is no issue.
    - Test Result: fail. Because I have a backwards dependency, which is cicular.

- The only way this can work, is that we modularize our game loop functions, and the react app controls them accordingly.

Error: RollupError: Illegal reassignment of import "gameState" in "src/app.jsx"
    - I don't need to export this variable. I can just definie it in App.jsx (because thats where state should be)

New Separatation for our Refactoring:

App.jsx: The control code, network code and state management code needs to live here
Megafile.js: UI, callback setting and data model needs to live here.

Ideally, I would like Network, UI, DataModel, RuleChecking and such in their own files, with dependences pointing toward them (so App.jsx is dependent on everything only). But I'll do this after the first refactor.

- classes/functions dependent on gameState global variable:
    - main_turn_loop
    - second_wall_click.get_wall_list().push_new_wall()

- OUr data model is setup such that:
    - GameState.js
        - Player Queue (list of GamePlayers)
        - Wall_List
- and we can only get access to such items via the GameState. This means we must extract necessary state in app.jsx, and pass it to the imported functions. Some functions will have to be split up and made more atomic, for this to happen.

- learning point: If I import a global (var) from a file, it is read-only - it can't be changed in the file it was imported to (gives us a rollup error).

- Understanding Hoisting:

- using the "function" keyword hoists a function to the top of the functional scope.
    - this is not true of arrow functions
- let and const:
    - block scoped
    - if try to access outside of scope, get a Reference Error
- var is hoisted to the top of the functional scope. It gets pulled through a block, even if its nested. Only the declaration is hoisted, however
- Example:

```
function myfun() {

//Var can be accessed here (but will return undefined)
//let and const will throw an error in console.

if (condition) {
    var p1 = 0
    let p2 = 0;
    const p3 = 0;
}
}

```
- function declarations are hoisted.
- function expressions, arrow functions, and function constructors are not (cannot call before definition).



### September 15th:

- I have separated my code out now. The state management and main control loops live in App.js, and the UI/some event and rule checking code live in megafile.js.
- Instead of doing a refactor again (to put all javascript code into external module files), its time...to work on state. 

- The first thing that needs to be done, is wall and move actions need to be set up.
- A state handling mechanism with our Global Store also needs to be designed, to allow our game control loops and the GS functions to interact.

- which control functions need network/state access?

- start_game_request:
    - send an %init request with data

    - player_click_move():
        - send a %move request to server

    - second_wall_click():
        - register a %wall 

    - it is better to have dedicated functions that setup our requests and call network functionality, rather than crowd player_click_move
    and second_wall_click.

    - the send_move function should actually call main_control_loop(),
    not the endpoint functions of a move.


- wall and move pokes have been setup. 
- Next: Setup the initialization logic for our client.
    - send an [%init target=~zod, p1name=@p, p2name=@p]
        - our BE must determine wall counts, current position and send back player number.


- I really need to finalize the initialization segment of my game.

1) We send a subscription request to the client. This must always be done first.
    => We must clean out the state when this is done (on reset of browser).
        => Any player state or map is emptied.
        => Turn count is zero.
        => Wall List is also set to be empty by the client.
    => Reducer state? Other than the init wire path, nothing needed.


2) Once subscription wire is setup, the client sends a request with two user names.
    => The client must send back which users are user1 and user2. The FE determines the colours and wallcounts.
    => For now this is a trivial request, just send back what the FE sends, and parse it.
    => fetch data packet, and alter gameState.

3) Once the game is setup and running, we progress with move and wall packets.

=> (!!) Restarting our browser restarts the backend, with this configuration
- unknowns (do we need async/await for promises?)
- Should we rely on Reacts GlobalStore more? Or just use it as a quick interface to fetch the data
    => Do the latter for now.

- said goodbye to %echo's FE state UI,and all the push and pop stuff in the BE. No more!

For Later, some frond Examples and code:


      ::%init   To remember how to frond a list correctly - remove later! 
        ::   %+  frond  'init'
         ::    %-  pairs
           ::  :~  ['val' a+(turn val.upd numb)]
            ::     ['tc' (numb tc.upd)]
           ::   ==

      ::%init  (frond 'init' a+(turn val.upd numb))
      ::%sendplayer  ::[Q: ]  we don't need this. Why does hoon complain??
      ::     %+  frond  'sendplayer'  ~

::for a deeply nested wall structure
::['p2name' (numb row.pos1.upd)]


::      %clearstate  ~&  "our clearstate"  ~&  upd
::          %+  frond  'ack'
::            %-  pairs
::            :~  ['result' s+(%t result.upd)]
::            ==

From our push and pop in poke arm:

      %push
    ~&  "our push act"  ~&  act 
    ?:  =(our.bowl target.act)
      :_  this(values [value.act values])
      [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %quoridor] %poke mark vase]~
  ::
      %pop
    ~&  "our pop act"  ~&  act 
    ?:  =(our.bowl target.act)
      :_  this(values ?~(values ~ t.values))
      [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %quoridor] %poke mark vase]~
  ::


## September 16th:

- continuting with the stateupgrade branch, it is time to add %moves and %walls, and manipulate our state.
- how do we deal with asynch responses?
    => For now, we rely on the subscriber wire and the updateHandler function. This will continue our game loop.
        => Will need to be done more formally with await/Promise manipulation, later on...


For Safekeeping:

      %move  ~&  "our move update"  ~&  upd  
          %+  frond  'move'
             %-  pairs
             :~  ['target' s+(scot %p target.upd)]
                 ['row' (numb row.pos.upd)]
                 ['col' (numb col.pos.upd)]
              ==
      %sendwall  ~&  "our move update"  ~&  upd
          %+  frond  'wall'
            %-  pairs
            :~  ['target' s+(scot %p target.upd)]
                ['p1row' (numb row.pos1.upd)]
                ['p1col' (numb col.pos1.upd)]
                ['p2row' (numb row.pos2.upd)]
                ['p2col' (numb col.pos2.upd)]
            ==


## September 18th:

- Yesterday I was able to finally finish my state upgrade. The app works, with two players being served by one FE and one BE.
- Now, I need to start using Ames, to get two clients to communicate with each other.

- Apps that Demonstrate an Ames request:
    - Flap
    - Groups/Messaging App.


- I don't really have time to get these apps functioning. The code needs to be read carefully, and tested+integrated in small stages.
    => The usual "Ship-of-Theseus" approach. applies.

- The Ames documentation is quite hard. It seems we need a %plea to send data over the network, or we need to invoke Ames arms to send requests. This will be quite hard...
    => The Hut app needs 

#### Turning to App Distribution (Instead):

- I am on Zuse 418. Will this be a problem for the install? What sys version will the judges be using (412?)
- It just looks as if the app needs to run on a fakezod and be discoverd. Is that all?


### The Groups App Tutorial:

- This app apparently demonstrates communication between many ships.
- mapped out the pathways, and looked at the code. now its time to design our interactions.
- the solution to communicating between two ships is just mutual subscriptions, and passing cards. I don't need to 
  worry about Ames much.
  - for zuse 412K, you just |bump your app in Dojo to see if it upgrades. Usually, it works.



### Nov 3rd:

#### Designing the Initiation Sequence for Two-Players:

Two players decide (outside of the Quoridor app) to play a game of Quoridor.

0) Both players must open/reload the FE of the Application. Call the players X and Y.  
    - [X] For each player, the %init subscription wire is hit.
    - [X] For the BE, the ++on-watch arm is hit, and a subscribe wire is placed on the /qdata path.
        - on-watch must be switched on remote/local, use the |^ pattern
            - because the FE and other BE agent will subscribe to our local BE
    - [/] IF the app has a non sigg'ed (empty) state, we must overwrite the state accordingly. Use a gate for this.
    - [X] We send back an %init update, to clear the state in FE and begin our initialization sequence.

2) Player X types in the @p of player Y, and hits the [Send Request ->] button.
    - A poke request from the FE is passed to the backend, as [%setupplayers target=@p p1name=@p p2name=@p]
    - The ++on-poke arm is invoked. 
        - first, check if the poke is from our ship, or from some other player (local/remote branching)
            - switch to the local branch:
                - switching on %setupplayers.
                        - our (list card this) that we return is as follows:
                            - formulate a card to make a subscribe request to our remote player.
                                - so %pass %agent %watch  /wire path formulated as /game/<timestamp or entropy>
                            - END.

    Player Y's Agent:
        - receives the %pass %watch card to its ++on-watch arm. 
            - Gall/System sends a %watch-ack (automatically).
            - Or sends a watch-failure/error. Or the subscribe doesn't work. Player X on-agent arm needs to deal with this.
                - sign: watch-ack: just print "successful to console"
                - sign: watch-nack: there is an error, report to player X FE to try again?
                - what if player Y cannot be reached? => Test this manually.
            
            - check if game currently running. Reset it if not sigg'ed.
            - insert the src.bowl ship as new player in pmap
            - insert our.bowl ship as player 2 in pmap 
            - Init %give %fact Card 1:  ::Note, this is NOT done with action/update, so no need to worry about grab/grow/
                - send an init %fact with state, to write to Player 1.
            - Generate a %gift %fact card to FE -> Tell the front end that a game has started. update [%gamestart  vase(..player info)]

    Player X's Agent:
        - ++on-agent arm recieves an initialization %give %fact. This finalizes and starts game, [%finalize game]
        - updates state
        - Generates a Gift Card for the FE -> [%gamestart  vase(..player info)]


3) At this point, both clients have been set up, and should understand who is player 1 and 2. Player 1 makes a move.
    - from the FE, a [%sendmove target=@p pos=position pnum=@ud] is sent to the BE.
    - the ++on-poke arm checks if local/remote
    - switch on %sendmove
        - update the current player position.
        - increase turn count by one.
    - Two cards:
        1) %give %fact across the /games wire, communicate the move to player 2
        2) %give %fact to our FE - now it is P2's turn, and we need to wait.

    - While this is going on, Player 2 enters the "waiting" state.
        - it recieves a %give %fact via wire from Player 1.
        - it sends a %give fact to the FE, updating teh screen with the player 1's move.

4) By this point, the behaviour in (3) should loop until a reset/termination condition is detected.
    - FE must be in a "make move" or "wait for other player" state.

5) After a move phase, the FE rule checker must determine if a win has occured.
    - If a win occurs, a [%win] poke is sent to the BE.
    - ++onpoke arm processes the local win,
        - a %give %fact card is sent to the other player.
        - a %give %fact is sent to the FE, verifying the Win!

    - Other Player:
        - ++on-agent arm revieces the %give fact win packet.
        - %give fact is routed to FE, to inform the other player that they lost.

After this point, the game has reached its final state. A reset must occur.


5) The FE


### Nov 4th:
    - FF'ed main to stateupgrade.
    - pushed main one trivial commit ahead.
    - kept stateupgrade branch pointer (for history). Made a new branch pointer (initsequence).
    - commit and move ahead on initseuqence, do a huge merge on main at the very end (fun...).
    - need a second galaxy ship (~fes) to be built.
        - as I upgrade the code base, the code must be identical for both agents. so...
            - alter cp2zod -> cp2all to copy over files.
    - bump ~zod from zuse 418 to 412. Fes should be OK. 
        - strangely, the latest dev-pill doesn't progress beyond 415?
        => Fake zods don't have network access.
    - For now, I just develop on two fake zods. Upgrading Zuse from 415/418 -> 412 can be dealt with later.
    - Notice: All three hackaton contestants used Moons to distribute their apps. So they ran treaty from their apps.
        => You can also do this from a comet. So not being present on Azimuth (L1/L2) =/> you cant use Ames:glob or distribute software.
            - really, any type of entity (galaxy....comet) can distribute software on the network.
    - its best to develop on two fake zods for now. If issues occur, I can cart both instances over to two moons.
        => In the end, my dev desk will be hosted on a moon and |treaty'ed on the network.

    - Paths are used to route subscription requests or data to an agent.
    - wires are used to route responses.

### Time To Begin:

    - [X] for ++on-watch, we have just one subscribe wire. Call it `/qdata`.
    - [X] |^  (local) (remote) ++remote ++local  code pattern has been implemented in ++on-poke.
    - getting knee deep in subscription mechanisms. Our session requires 4 subscriptions: 2 subscriptions, between FE and BE for each agent, and a 2 way subscription between the two BE agents.
        - getting this working, and then programming the "win" condition to terminate should be the first goal, not a DFS into the requirements.
     

### Weekend: Nov 17th:

- finally made some progress on my game initialization code. 
    - was stuck on a find.$ error for a long time. I even went over cores all over again, to no avail.
    In the end the error was the following:

```
  !:  |=  =path  
    ^-  (quip card _this)
    |^  ::...how i learned to stop worrying and love the bar-ket.
      ?~  path  !!  ?:  =(our.bowl src.bowl)  (localarm path)  (remotearm path)
      ++  localarm  ::Refreshing the page removes our old subscriptions, for now....
      ::apparently, we don't need a case for %leave. Arvo/Gall will deal with it (?)
        |=  path=(list @ta)

```

- setting |=  =path for the most nested gate caused the $ error. I am not sure why this is, as I have seen this coding pattern work in other contexts. I guess there are too many paths floating around (strucure and face), and the compiler just gets confused.

- So far, I have implemented the following:

- on FE browser reset (=> on watch local arm): send a card cancelling the old subscription. Both clients need to do this, to eliminate their old subscriptions.
- poke: start game request:  makes a watch request to a target client. Target client recieves this on the on-watch:remote arm.
- here players are initialized for target, and a response %fact is sent back, so initiator can configure the game for themselves.

- i still need to deal with the subscription errors, and processing the cage. how do I process a cage??

- Needed to read up on:
++on-agent ++on-watch, cards, cages...etc.
- my app bounces around betwen on-watch, agent and poke, basically.


###  Nov 20th:

-  Figured out cages.  A cage is a structure that looks like the following:  [p=[%mark] q=[ - serealized data]]
- a cage is nested inside a sign, for example:

"what a sign looks like:"
[ %fact
    cage
  [ p=%quoridor-update
      q
    [   #t/
        upd
      ?(
        [%init tc=@ud]
        [%okmove status=@t tc=@ud]
        [%okwall status=@t tc=@ud]
        [%passign p1=@p p2=@p]
      )
      q=[31.075.950.044.340.592 0 255]
    ]
  ]
]
Our actual q value, unserialized and cast by our update looks like:
>>  [%passign p1=~zod p2=~fes]

This is done with the following code:      ~&  >>  !<(update q.cage.sign)


## November 21st:

- for cages, there is an issue of using the decoded value (such as p1 or p2). The hoon compiler thinks things are underspecified.
- typecasting explicitly ^-  is not enough, nor is testing for sig. We get a find-fork error.
- how do we specify existance enough?  The huts app gives the ansewr:

```
    ?>  ?=(%quoridor-update p.cage.sign)
    ::setup our initial structure.  ::send a response card to the front end.
    =/  decage  !<(update q.cage.sign)  ~&  decage
    ?+  -.decage  `this
      %passign
      =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 p1.decage playpos1 10]
      =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 p2.decage playpos2 10]
      :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ourpnum  1  ==  ~
    ==
```

## November 25th:

- Now we have the basic handshake setup. It is time to implement functionality for the main game.

- send a %passign card to each FE, so they know who takes the first turn.

- implement %move:
    - this is just a poke to the BE, in which local state object is updated.
    - send a %fact card to our other BE, which causes a state update there, and a %fact is sent to the other FE to update the UI.

- implement %wall
    - exact same strucutre of functionality for %move, but just with %wall functions and control forking.


-  looks like %quoridor sends two cards to the FE (for zod), causing a double update (pushes game state to move 2, and misaligns the moves between two FE agents.

- You can't easily just clear the sup.bowl, other than with |nuke.  What else can we do?
- those hexadeximal wires are actually http-api forming subscriptions with Eyre. Need to learn more about Eyre:

#### Eyre:

- Eyre calls apps, not (usually) the other way around.
- airlock library contains http-api
    - this system uses the Eyre External API 
    - when we setup a subscribe to %quoridor, we are really setting up a channel between Eyre and our FE
    - channels are NOT subscriptions. Think of a channel as a session, and we can have multiple subscribes (with paths), per channel.
    - we can eliminate all subscriptions, with api.cancel() and api.reset().

    - what happens when i reload the FE (glob), and call the reset and cancel functions??
    - Answer:  Nothing!  Back end sup.bowl stays teh same.

    - To clear all the sup.bowl subscriptions, I ran |nuke and then |rein %quoridor. 

    - So we are back to start...

- time to implement the reverse subscription (from ~fes to ~zod). And then post the card from ~zod to the FE.

- when i resubscribe FE to Eyre, I only see one entry in sup.bowl. Not multiple entries.
- our %clearstate  poke does clear out the wex.bowl (incoming subscriptions), thankfully! 

- Accedentally created a ~zod infinite loop with:

```
      %passign  ::[!!!]
      =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 p1.decage playpos1 10]
      =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 p2.decage playpos2 10]
      :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ourpnum  1  ==  ~
      ::[%give %fact ~[/qdata] %quoridor-update !>(`update`[%passign p1=p1.decage p2=p2.decage])]~
```

And bricked my zod :(. Will rebuild a new zod tomorrow. Cards are getting complicated, and I think I am overusing wires+paths, which is causing confusion. Will need to redesign the handshake codebase accordingly.

### Nov 27th:

Some interesting testing results found.

1)  The json.hoon file in 412K differs from 415K. So When I copy over the files with cp2all, the old json file gets copied, 
leading to /mar cant find $ errors in the console.

2) I can send a %hello sub from ~fes (415K) to ~zod (412K), but not the other way around! Zod just hangs, and if i try twice I get a duplicate subscription error.  Our subscription is not registered by ~fes, and no %ack is sent by ~fes. Strange...

It looks like I will have to upgrade ~fes to 412K, somehow...
    => tried to |bump .  lead to a generator failure

- upgrading to 412K seems to work.  Both agents subscribe to one anotehr (witha  few weird details that need to be investigated...next time).


### Dec 16th:

Decided to experiment with React Imports again. Sadly, the structure I have for importing my jQuery files is fixed.
Things I tried:

- using simple imports "import "./afile.js" " does not work.
- using a default functional bundler does not work: I get void (0) errors.

```
const fun1 =  () => { ...}
const fun2 =  () => { ...}

const bundler = {
    fun1, fun2,
}

...
import bund as bundler from "./afile.js"
import * as bundler from "./afile.js"

}

```
- Trying to import a react facing functionm (with support funtions left in the file) does not work. Even worse, 
no errors are reported when the functions are not called (!). leading to weird runtime errors. For example:

```
import {myfun} from "myfile.js"


...

export function myfun() {
    return test2() + "!!!"
}

export function test2() {
    return "Hello"
}

```

Will just return "!!!". It just skips over the function.  

The Bundler module (Rollup) has some quite strange effects. In theory, it should be possible to have levels of imports, but
this likely requires some heavy customization to rollup, which is beyond my experience level. I could spend hours trying to figure it 
out, but its better just to find an expert who can resolve it in 15 minutes.

- So I am stuck with the rather nasty import system I have. I might as well delete the old segmented files, as they will never be used at this point.  I just have to import every single function from one file, and that sucks (for now).


So I am near the end of my project now. I just need to do the following:
-  get moves working [X]
- and walls working [X]
- code a basic win condition (for rule checker)
-  reduce BE code redundancy, gate all of the code to make the gall app much cleaner.
-  get images working [X].
-  clean up CSS issues. 
-  clean up front end
    - proper comments [X]
    - remove redundant functions 
-  document the project (give an outline of how it works).
- directory and file cleanout.

So here we go...

