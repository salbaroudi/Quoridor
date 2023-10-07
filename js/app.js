
/* This is the main file, which knits together all of our functionality, and
contains all of our event programming to run the game loop.

It uses functions from other files to perform its work. Including:

- ui.js
- rulechecker.js
- network.js

These three files do what you would expect them to do.

Some of the functionality between the files is intertwined, so it can't
be perfectly separated. I have chosen to include all event setting/removal
functions to be in ui.js, to keep this file a bit cleaner.
*/

let gameState = 0;

/*
Shortens our constuctor inputs, and makes initialization easier.
Input: Integers: 1,2,3,4 only. Report error otherwise.
*/
function playerinit(num) {
    let tuple = 0;
    switch(num) {
        case 1:
            tuple = [1,"blue",4,"sq-0-8"];
            break;
        case 2:
            tuple = [2,"orange",4,"sq-16-8"];
            break;
        case 3:
            tuple = [3,"green", 4,"sq-8-16"];
            break;
        case 4:
            tuple = [4,"purple",4,"sq-8-0"];
            break;
        default:
            console.error("Error: Player Number not recognized.");
    }
    return tuple;
}

/*
    Called onLoad() of application. 
*/
function initialzeGame() {
    gameState = new State();
    $(".send-request-button").on( "click", start_game_request);
}

/*
    Game starts when user enters @p and hits Send Request button.
    This function initializes a game session.
*/
function start_game_request() {
    //[!!!] Get user name from {window.ship}
    let p1name = "~sampel-palnet"; 
    let p2name = $("#at-p").val();
    //[!!!] Here we send an async request to our Back end, perform the negotiation.
    gameState.add_player(new Player(p1name, playerinit(1)));
    gameState.add_player(new Player(p2name, playerinit(2)));
    //update status container UI.
    player_status_init(p1name,p2name);
    console.log(gameState);
    setup_board(playerinit(1)[3],playerinit(2)[3]);
    main_turn_loop();
}


function main_turn_loop() {
    //select next player, incr turn count.
    let currPlayer = gameState.next_player();

    //Console print out, for reference:
    console.log("Turn:"  + gameState.get_turncount() + " has begun.");
    console.log("Our Player Selected is:" + currPlayer.get_ship_name());
    // Inspect state at every turn, for now.
    console.log(currPlayer);

    toggle_player_status(currPlayer);

    hovers_and_clicks(currPlayer);
    //Click events for Walls and Squares are set. Now we wait...
}

/*
    These side-effects needed to be bundled together, because
    we can prematurely exit from the Wall Movement code.
    A player can press the [ESC] key to cancel, or click the wrong
    wall for its second point. So we have to reset the players move 
    without calling next_player().
*/
function hovers_and_clicks(currPlayer) {
    hover_square_on();
    hover_wall_on();
    main_click_on(currPlayer);
}

/*
    Signature:  (playerObject, newId)  -->  Void (side-effect) 
    Player clicking a square selects a move sequence. Perform the necessary actions.
    */
function player_click_move(currPlayer,newId) {
    const oldId = currPlayer.get_board_pos();
    unhighlight_old_pos(oldId);
    check_pawn_move(oldId,newId);
    move_pawn(oldId,newId,currPlayer.get_colour());
    //Update our player, update our turn count.
    currPlayer.update_board_pos(newId);
    //Next move. Go back to start.
    main_turn_loop()
}

function player_click_wall(currPlayer, newId) {
    //First, deactivate all click moves for squares.
    main_click_off_squares();
    //highlight wall next
    set_w2_keypress(currPlayer,newId);
    select_wall_segment(newId);
    //Now we wait - player presses [ESC], or chooses a second wall.
}

function second_wall_click(currPlayer,w1Id,w2Id) {
    //If we get here, we construct our wall from the two points, add it, print it to console, 
    //..reset everything,and then go back to main_turn_loop()
    console.log("Second wall was clicked. Finalizing Move.");
    console.log("Wp1:"  + w1Id);
    console.log("Wp2:"  + w2Id);

    //Clean up all events.
    main_click_off_walls();
    hover_square_off();
    hover_wall_off();
    keydown_off();

    //Lets get the wall set, and highlihgted.
    // [!!!] Doesn't work.
    select_wall_segment(w2Id);
    gameState.get_wall_list().push_new_wall(w1Id,w2Id);

    //A wall has been used, now take away a wall from a player
    currPlayer.decr_wall_count();
    status_remove_wall(currPlayer);

    //Switch to next player...
    main_turn_loop();
}

function keyboard_abort(currPlayer,id) {
  //If we get here, we need to reset everything and go back to player click move
    console.log("Keyboard escape pressed. Aborting move")
    //remove all click events
    main_click_off_walls();
    hover_square_off();
    hover_wall_off();
    keydown_off();
    unselect_wall_segment(id);

    //reset turn loop without changing player. This player still needs to move.
    hovers_and_clicks(currPlayer);
}

initialzeGame();