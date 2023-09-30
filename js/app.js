let gameState = 0;

/*
Shortens our constuctor inputs, and makes initialization easier.
Input: Integers: 1,2,3,4 only. Report error otherwise.
*/
function playerinit(num) {
    let tuple = 0;
    switch(num) {
        case 1:
            tuple = [1,"blue",4,"0.4"];
            break;
        case 2:
            tuple = [2,"orange",4,"6.2"];
            break;
        case 3:
            tuple = [3,"green", 4,"2.0"];
            break;
        case 4:
            tuple = [4,"purple",4,"4.6"];
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
    //First get the user name from the input box.
    //Here we send an async request to our Back end.
    //We read the name of our ship from {window.ship}, which is provided by our react app.
    let p1name = "~sampel-palnet"; //assume default for now.
    //Next Make two players 1 and 2.
    let p2name = $("#at-p").val();

    gameState.add_player(new Player(p1name, playerinit(1)));
    gameState.add_player(new Player(p2name, playerinit(2))); 
    UIChanges.start_game_request(p1name,p2name);
    console.log(gameState);
    //Next, we begin our game loop.
    UIChanges.setup_board("s0-8","s16-8");
    mainturnLoop();
}

function hoverSquare() {
    $('div[id^="sq-"]').hover(function() {
        // This function is executed on hover (mouseenter)
        // You can add your hover-related code here
        $(this).attr("class", "ref-cell-square square-lighter");// Example: Change background color
      }, function() {
        // This function is executed when the hover ends (mouseleave)
        // You can add code for when the mouse leaves the element
        $(this).attr("class", "ref-cell-square"); // Example: Reset background color
      });
    return;
}

//we actually cant do a class change trick, because we have two types of wall (!)
function hoverWall() {
    $('div[id^="wa-"]').hover(function() {
        // This function is executed on hover (mouseenter)
        // You can add your hover-related code here
        $(this).css('background-color', '#0000E1'); // Example: Change background color
      }, function() {
        // This function is executed when the hover ends (mouseleave)
        // You can add code for when the mouse leaves the element
        $(this).css('background-color', '#000096'); // Example: Reset background color
      });
    return;
}


function mainturnLoop() {
//We need functions that activate a game mode: Player 1 must make a move.
//We need to enable hover and click events for the walls, or the boards. This is done with highlighting.
hoverSquare();
hoverWall();
return;
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