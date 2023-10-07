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
    a player can press the [ESC] key to cancel, or click the wrong
    wall for its second point. So we have to reset the players move 
    without calling next_player().
*/
function hovers_and_clicks(currPlayer) {
    hover_square_on();
    hover_wall_on();
    main_click_on(currPlayer);
}

/*
    This starts our move sequence for a selected player.
    Click events are turned off to start, to stop old events piling up.
    Player can make one of two moves: {movePawn or placeWall}.
    */
function main_click_on(currPlayer) {
    main_click_off_squares();
    main_click_off_walls();
    //Attach only **one** set of events.
    $('div[id^="sq-"]').click(function() { player_click_move(currPlayer,$(this).attr("id"))});
    $('div[id^="wa-"]').click(function() { player_click_wall(currPlayer,$(this).attr("id"))});
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

//If any keyboard button is clicked during wall selection, abort move.

function player_click_wall(currPlayer, newId) {
    //First, deactivate all click moves for squares. Player has made their choice already.
    main_click_off_squares();
    //highlight wall next
    select_wall_segment(newId);
    //Next, we need two more callbacks.
    //One callback is for a keyboard press, the other for our second wall...
    set_w2_keypress(currPlayer,newId);
    //Another callback is for the selection of a second wall point.
}

function keyboard_escape(event, currPlayer) {
         if (event.keyCode === 27) {
            keyboard_abort(currPlayer);
        }
}

function keyboard_abort(currPlayer) {
  //If we get here, we need to reset everything and go back to player click move
    console.log("Keyboard escape pressed. Aborting move")
    //remove all click events
    main_click_off_walls();
    hover_square_off();
    hover_wall_off();
    keydown_off();

    //reset turn loop without changing player. This player still needs to move.
    hovers_and_clicks(currPlayer);
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
    select_wall_segment(w2Id);
    gameState.get_wall_list().push_new_wall(w1Id,w2Id);
    
    //Switch to next player...
    main_turn_loop();
}


/* Basic Test Script to test our Object and Data Structures 

Script:
- initialize game state.
- set client to Player 1
- create a player 2, add to the queue.
- Move Player  1 a few times
- Move Player 2 a few times
- Place a few walls for player 1
- Place a few walls for player 2
- Print out game state.
*/
function testDSO1() {
    let GameState = new State();
    GameState.add_this_player(new Player("~sampel-palnet", playerinit(1)));
    GameState.add_player(new Player("~docdyl-todsup",  playerinit(2)));

    //Player Queue should have two players.
    p1 = GameState.next_player();
    p1.update_board_pos("0.6");

    p2 = GameState.next_player();
    p2.update_board_pos("6.0");

    p1 = GameState.next_player();
    p1.update_board_pos("2.6");

    p2 = GameState.next_player();
    p2.update_board_pos("4.0");

    p1 = GameState.next_player();
    p1.update_board_pos("2.4");

    p2 = GameState.next_player();
    p2.update_board_pos("4.2");

    console.log("Player 1 Board Position: " + p1.Board_Pos);
    console.log("Player 1 Board Position: " + p2.Board_Pos);

    //Now lets add some walls.

    p1 = GameState.next_player();
    GameState.get_wall_list().push_new_wall("1.0","1.2");

    p2 = GameState.next_player();
    GameState.get_wall_list().push_new_wall("1.4","1.6");

    p1 = GameState.next_player();
    GameState.get_wall_list().push_new_wall("5.0","5.2");

    p2 = GameState.next_player();
    GameState.get_wall_list().push_new_wall("5.4","5.6");

    //A little bit ugly. Hmm...
    console.log("Our Walls:" + GameState.get_wall_list().get_wall_list());

    console.log("Our number of walls remaining:" + GameState.get_wall_list().get_walls_remain());

    console.log("END");
}

initialzeGame();