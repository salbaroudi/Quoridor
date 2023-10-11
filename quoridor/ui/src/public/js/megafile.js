import $ from 'jquery';

export let gameState = 0;

export class GameState {
    //This is run when the App initializes.
    constructor() {
        //Initialization value in time.
        this.Timestamp = Date.now();
        this.Turn_Count = 0;
        //Player Queue.
        this.P_Queue = [];
        this.Wall_List = new Wall_List();
        //Player running this particular app.
        this.Curr_Player = 0;  //Defaults to zero (need to negotiate session first).
        this.Num_Players = 0; // ""
    }

    get_wall_list() {
        return this.Wall_List;
    }

    //Number of Players field set after add_player finishes.
    add_player(player) {
        if (!(player instanceof GamePlayer)) {
            console.error("Error: addPlayer - input not a Player Object");
        }
        this.P_Queue.push(player);
        this.update_num_players();
    }

    //Called for this instance. Must set the Curr_Player field.
    add_this_player (player) {
        if (!(player instanceof GamePlayer)) {
            console.error("Error: add_this_Player - input not a Player Object");
        }
        this.Curr_Player = player.P_Number;
        this.add_player(player);
    }

    update_num_players() {
        this.Num_Players = this.P_Queue.length;
    }

    //returns next player object, update turn count.
    next_player() {
        let next = this.P_Queue.shift();
        this.P_Queue.push(next);
        this.turncount_incr();
        return next;
    }

    get_turncount() {
        return this.Turn_Count;
    }

    turncount_incr() {
        this.Turn_Count = this.Turn_Count + 1;
    }

    numplayers_incr() {
        this.Num_Players = this.Num_Players + 1;
    }
}

/*
Our Player Object. Stores most of the details, segmented by player. 
Fields:
- Name: An @p shipname.
- P_Number: A number, 1-4.
- Colour: String that indicates pawn colour.
- Board_Pos: Pawn's current position on the board.
- Path_List: An object class that stores the path our current pawn has taken.
- Wall_Count: Number of walls player has left. From 0-X only.
*/

export class GamePlayer {
    //Use player init function to initialize properly. Initialized after session negotiation.
    constructor(shipName,tuple) {
        this.Name = shipName;  //Immutable Propeties - set on Init.
        this.P_Number = tuple[0]; this.Colour = tuple[1];
        this.Wall_Count = tuple[2];  //Mutable Properties
        this.Board_Pos = tuple[3];
    }

    //Input: string of format "X.Y" where X and Y are whole numbers in board range.
    update_board_pos(pos) {
        if (!(typeof pos === "string")) {
            console.error("Error: Board position update not a string. Check input.");
        }
        this.Board_Pos = pos;
    }

    get_board_pos() {
        return this.Board_Pos;
    }

    get_ship_name() {
        return this.Name;
    }
    get_colour() {
        return this.Colour;
    }

    get_number() {
        return this.P_Number;
    }

    get_wall_count() {
        return this.Wall_Count;
    }
    decr_wall_count() {
        if (this.Wall_Count > 0) {
            this.Wall_Count = this.Wall_Count - 1;
        }
    }
}

/*
    Remember: Change number of walls for updatd board [!!!]
    Used by the Global state class to hold all of our used walls. 
    */

export class Wall_List {
    constructor() {
        this.Wall_List = [];
        this.Remain_Walls = 8;    
    }

    wall_count_dec() {
        this.Remain_Walls = this.Remain_Walls  - 1;
        if (this.Remain_Walls <= 0) {
            console.error("Error: Wall Count decrement at wc = 0. Error in Game State.");
        }
    }

    /*
    Wall Format: "<start pos>,<end pos>".
    When the user is selecting a wall, we check if its a valid wall there.
    Use new_wall_encode() to process input, so push_wall_list(new_wall_encode(p1,p2))
    By this point, we assume that we are inputting a valid wall, and check the formatting only.
    */
    push_new_wall(p1,p2) {
        //Error checking here [!!!]
        let ourWall = "<" + p1 +  "," + p2 + ">";
        console.log("push_new_wall(): wall added: " +ourWall);
        this.Wall_List.push(ourWall);
        this.wall_count_dec(); 
    }

    //Used by rule checker.
    get_wall_list() {
        return this.Wall_List;
    }

    get_walls_remain(){
        return this.Remain_Walls;
    }
}

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

/*
Shortens our constuctor inputs, and makes initialization easier.
Input: Integers: 1,2,3,4 only. Report error otherwise.
*/
export function playerinit(num) {
    let tuple = 0;
    switch(num) {
        case 1:
            tuple = [1,"blue",10,"sq-0-8"];
            break;
        case 2:
            tuple = [2,"orange",10,"sq-16-8"];
            break;
        case 3:
            tuple = [3,"green", 5,"sq-8-16"];
            break;
        case 4:
            tuple = [4,"purple",5,"sq-8-0"];
            break;
        default:
            console.error("Error: Player Number not recognized.");
    }
    return tuple;
}

/*
    Called onLoad() of application. 
*/
export function initializeGame() {
    gameState = new GameState();
    setup_left_console();
    setup_help_box();
    $(".send-request-button").on( "click", start_game_request);
    log_to_console("Please enter an @p in the [Username] box to begin...");
}

/*
    Game starts when user enters @p and hits Send Request button.
    This function initializes a game session.
*/
export function start_game_request() {
    //[!!!] Get user name from {window.ship}
    let p1name = "~sampel-palnet"; 
    let p2name = $("#at-p").val();

    //poke_initplayers(p1name,p2name);

    //[!!!] Here we send an async request to our Back end, perform the negotiation.
    gameState.add_player(new GamePlayer(p1name, playerinit(1)));
    gameState.add_player(new GamePlayer(p2name, playerinit(2)));
    //update status container UI.
    player_status_init(p1name,p2name);
    console.log(gameState);
    setup_board(playerinit(1)[3],playerinit(2)[3]);
    log_to_console("Game Start!");
    main_turn_loop();
}


export function main_turn_loop() {
    //select next player, incr turn count.
    let currPlayer = gameState.next_player();

    //Console print out, for reference:
    log_to_console("Turn:"  + gameState.get_turncount() + " has begun.");
    log_to_console("It's " + currPlayer.get_ship_name() + "'s turn.");
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
export function hovers_and_clicks(currPlayer) {
    hover_square_on();
    //hover_wall_on();
    main_click_on(currPlayer);
}

/*
    Signature:  (playerObject, newId)  -->  Void (side-effect) 
    Player clicking a square selects a move sequence. Perform the necessary actions.
    */
export function player_click_move(currPlayer,newId) {
    const oldId = currPlayer.get_board_pos();
    unhighlight_old_pos(oldId);
    check_pawn_move(oldId,newId);
    move_pawn(oldId,newId,currPlayer.get_colour());
    //Update our player, update our turn count.
    currPlayer.update_board_pos(newId);
    log_to_console(currPlayer.get_ship_name() + "has moved to square: " + newId);
    //Next move. Go back to start.
    main_turn_loop()
}

export function player_click_wall(currPlayer, newId) {
    //First, deactivate all click moves for squares.
    main_click_off_squares();
    hover_square_off();
    //highlight wall next
    set_w2_keypress(currPlayer,newId);
    select_wall_segment(newId);
    //Now we wait - player presses [ESC], or chooses a second wall.
}

export function second_wall_click(currPlayer,w1Id,w2Id) {
    //If we get here, we construct our wall from the two points, add it, print it to console, 
    //..reset everything,and then go back to main_turn_loop()
    log_to_console(currPlayer.get_ship_name() + " has placed a wall.");

    //Clean up all events.
    main_click_off_walls();
    hover_square_off();
    //hover_wall_off();
    keydown_off();

    //Lets get the wall set, and highlihgted.
    select_wall_segment(w2Id);
    gameState.get_wall_list().push_new_wall(w1Id,w2Id);

    //A wall has been used, now take away a wall from a player
    status_remove_wall(currPlayer);
    //This must be done after status_remove_wall()
    currPlayer.decr_wall_count();

    console.log(gameState.get_wall_list());
    //Switch to next player...
    main_turn_loop();
}

export function keyboard_abort(currPlayer,id) {
  //If we get here, we need to reset everything and go back to player click move
    log_to_console("[ESC] key pressed. Aborting move.");
    //remove all click events
    //hover_wall_off();
    keydown_off();
    unselect_wall_segment(id);

    //reset turn loop without changing player. This player still needs to move.
    hovers_and_clicks(currPlayer);
}

/*  Console and Help Box Support Functions */

export function setup_left_console() {
    $('#toggle-button-console').click(function () {
        $("#console-container").toggleClass("console-hidden");
        console.log($("#console-container").attr("class"));
    });
}
 
export function setup_help_box() {
    $('#toggle-button-help').click(function () {
        $("#help-box").toggleClass("console-hidden");
    });
}


export function log_to_console(message) {
    const consCont = $("#console-container");
    consCont.append(message + "<br />");
    // Scroll to the bottom to show the latest message
    consCont.scrollTop(consCont[0].scrollHeight);
}


/* Contains UI modification functions, and event "on/off" functions.
These functions are kept here as to make app.js a bit more clean.
*/

/*  Constants that are used in various ui.js functions */

// Hides the connect bar, and show the player boards.
export function player_status_init(p1name,p2name) {
    //hide the start game console.
    $("#connect-container").attr("class",
    "hidden " + $("#connect-container").attr("class"));
    //Make Player1 and Player2 visible.
    console.log(p1name);
    console.log($("#player-title1").html());
    $("#player-title1").html("Player 1: " + p1name);
    $("#player-title2").html("Player 2: " + p2name);
    $("#player-container").attr("class", "player-container");
}

//Place our pieces on the board 
export function setup_board(p1start,p2start) {
    const bluePawnImg = $('<img />', {
        id: 'bluepawn',
        src: 'public/img/blue_pawn_rs_small.png',
        });
    const orangePawnImg = $('<img />', {
        id: 'orangepawn',
        src: '/public/img/orange_pawn_rs_small.png',
        });
    
    const blueCell = $("#" + p1start);
    const orangeCell = $("#" + p2start);
    bluePawnImg.appendTo(blueCell);
    orangePawnImg.appendTo(orangeCell);
}

//This function highlights the players status box, and also highlights the pawn square.
export function toggle_player_status(player) {
    //toggle all status boxes off (no-highlight).
    status_box_off();
    // Turn on status bar, highlight on pawn square
    console.log(player.get_number()); console.log(player.get_board_pos());
    $("#player-title" + player.get_number()).attr("class", "player-title-invert");
    $("#" + player.get_board_pos()).attr("class", "ref-cell-square square-lighter");
}

export function unhighlight_old_pos(oldId) {
    $("#" + oldId).attr("class", "ref-cell-square");
}


export function move_pawn(oldId,newId,color) {
    const bluePawnImg = $('<img />', {
        id: 'bluepawn',
        src: 'public/img/blue_pawn_rs_small.png',
        });
    const orangePawnImg = $('<img />', {
        id: 'orangepawn',
        src: '/public/img/orange_pawn_rs_small.png',
        });
    const oldCell = $("#" + oldId);
    const newCell = $("#" + newId);
    let pPawn = bluePawnImg;
    if (color == "orange") {
        pPawn = orangePawnImg;
    }

    //empty old cell, place image in new cell
    oldCell.empty();
    pPawn.appendTo("#" + newId);
    //remove old square highlight.
    oldCell.attr("css", "ref-cell-square");
    newCell.attr("css", "ref-cell-square");
}


export function set_w2_keypress(currPlayer,w1Id) {
    //Clean up old events, again.
    main_click_off_walls();
    //just leave the hover events on for now
    // add keyboard scan and second wall click events are added.
    $("body").keydown(function(event) { 
        if (event.keyCode === 27) {
            keyboard_abort(currPlayer,w1Id);
        }    
    });
    $('div[id^="wa-"]').click(function() { second_wall_click(currPlayer,w1Id,$(this).attr("id"))});
}

//In this function, we
export function wall_point_orientation(parseId) {
//id format:  "wa-ROW-COL"
//A horizontal wall has an odd number in the row slot.
//A vertical wall has an odd number in the column slot.
    let result ="";
    let splits = parseId.split("-");
    if ((splits[0] != "wa")  && (splits.length != 3)){
        console.error("Error: Improper wall id passed to parse_wall_point_orientation(). ");
        return;
    }
    //horizontal wall.
    if (parseInt(splits[1]) % 2  != 0) { result = "horizontal";}
    //vertical wall.
    else if (parseInt(splits[2]) % 2  != 0) { result = "vertical"; }
    else { console.error("Error: No odd number in row or col slot. Erroneous state.")}
    return result;
}




//[!!!] We currently don't check if wall segments are in a line...
export function select_wall_segment(newId) {
    //Need to check if its a vertical or horizontal wall, and act accordingly.
    let result = wall_point_orientation(newId);

    if (result == "horizontal") { 
        $("#" + newId).attr("class", "ref-cell-b-wall wall-lightest");
    }
    else if (result == "vertical") {
        $("#" + newId).attr("class", "ref-cell-r-wall wall-lightest");
    }
    console.log("highlighted wall segment: "  + newId);
}

export function unselect_wall_segment(newId) {
    //Need to check if its a vertical or horizontal wall, and act accordingly.
    let result = wall_point_orientation(newId);

    if (result == "horizontal") { 
        $("#" + newId).attr("class", "ref-cell-b-wall");
    }
    else if (result == "vertical") {
        $("#" + newId).attr("class", "ref-cell-r-wall");
    }
    console.log("highlighted wall segment: "  + newId);
}

export function status_remove_wall(currPlayer) {
    let nextWallDiv = $("#p" + currPlayer.get_number() + "w" +currPlayer.get_wall_count());
    console.log("selected: " + "#p" + currPlayer.get_number() + "w" +currPlayer.get_wall_count());
    nextWallDiv.attr("class", "wall-indicator-off");
    //exit
}


/* On Side-Effect Functions */

//Attach hover mouse events to every square <div>
export function hover_square_on() {
    $('div[id^="sq-"]').hover(function() {
        $(this).attr("class", "ref-cell-square square-lighter");
      }, function() {
        $(this).attr("class", "ref-cell-square");
      });
}

//Attach hover mouse events to every wall <div>
export function hover_wall_on() {
    $('div[id^="wa-"]').hover(function() {
        $(this).css('background-color', '#0000E1');
      }, function() {
        $(this).css('background-color', '#000096');
      });
}

/*
    This starts our move sequence for a selected player.
    Click events are turned off to start, to stop old events piling up.
    Player can make one of two moves: {movePawn or placeWall}.
*/
export function main_click_on(currPlayer) {
        main_click_off_squares();
        main_click_off_walls();
        //Attach only **one** set of events.
        $('div[id^="sq-"]').click(function() { player_click_move(currPlayer,$(this).attr("id"))});
        //Check if we even have any walls.
        if (currPlayer.get_wall_count() > 0) {
            $('div[id^="wa-"]').click(function() { player_click_wall(currPlayer,$(this).attr("id"))});
        }  //Give the player a friendly reminder on console.
        else {
            $('div[id^="wa-"]').click(function() { console.log("Player has run out of walls. Invalid Move.")});            
        }
    }
    


/* Off Side-Effect Functions */
export function keydown_off() {
    $("body").off("keydown");
}

export function main_click_off_squares() {
    $('div[id^="sq-"]').off("click");
}

export function main_click_off_walls() {
    $('div[id^="wa-"]').off("click");
}

export function hover_square_off() {
    $('div[id^="sq-"]').off("mouseenter mouseleave");
}

// [!!!]  Any placed wall segment must be ignored.
export function hover_wall_off() {
    $('div[id^="wa-"]').off("mouseenter mouseleave");
}

export function status_box_off() {
    $('div[id^="player-title"]').attr("class", "player-title");
}


// [!!!] Dummy function for now. Define it later.
export function check_pawn_move(oldId,newId) {
    console.log("Checking Pawn Move...[OK]");
    return;
}