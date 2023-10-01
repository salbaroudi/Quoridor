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

function initialzeGame() {
    gameState = new State();
    $(".send-request-button").on( "click", start_game_request);
}

function start_game_request() {
    //First Get the user name from the input box.
    let p1name = "~sampel-palnet"; //assume default for now.
    //Next Make two players 1 and 2.
    let p2name = $("#at-p").val();
    //[!!!] Here we send an async request to our Back end, perform the negotiation.
    //[!!!] We read the name of our ship from {window.ship}, which is provided by our react app
    gameState.add_player(new Player(p1name, playerinit(1)));
    gameState.add_player(new Player(p2name, playerinit(2)));
    //update status container UI.
    player_status_init(p1name,p2name);
    console.log(gameState);  
    //Not **supposed** to access player directly, but this is just done once
    //[!!!] This code needs ot be parameterized/generalized.
    setup_board(playerinit(1)[3],playerinit(2)[3]);
    main_turn_loop();
}


function main_turn_loop() {
    //select next player from the data model.
    let currPlayer = gameState.next_player();
    let playerMode = "not-selected";
    console.log("Main Turn Loop: Our current player" + currPlayer);
    //toggle player's status box, turn off the others.
    toggle_player_status(currPlayer);
    
    //Set On Hover and On Click events.
    hover_square_on();
    hover_wall_on();
    click_square_on();
    click_wall_on();
    // at this point, we are just waiting for our click callback to work (on walls or squares)...
}

//When player clicks a square...
function player_clicked_square() {
// Get the #ID of the square that was clicked.
let id = $(this).attr("id");
console.log("Div clicked ID:" + id );
// Call the rulecheck function: is it a valid move?
check_pawn_move();

// Move the pawn.
    //Delete Image from appended Div
    //Add image to a new div
//un-highlight the square you are on.
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