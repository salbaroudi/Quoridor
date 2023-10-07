/* Contains UI modification functions, and event "on/off" functions.
These functions are kept here as to make app.js a bit more clean.
*/

/*  Constants that are used in various ui.js functions */

const bluePawnImg = $('<img />', {
    id: 'bluepawn',
    src: './img/blue_pawn_rs_small.png',
    });
const orangePawnImg = $('<img />', {
    id: 'orangepawn',
    src: './img/orange_pawn_rs_small.png',
    });


// Hides the connect bar, and show the player boards.
function player_status_init(p1name,p2name) {
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
function setup_board(p1start,p2start) {
    const blueCell = $("#" + p1start);
    const orangeCell = $("#" + p2start);
    bluePawnImg.appendTo(blueCell);
    orangePawnImg.appendTo(orangeCell);
}

//This function highlights the players status box, and also highlights the pawn square.
function toggle_player_status(player) {
    //toggle all status boxes off (no-highlight).
    status_box_off();
    // Turn on status bar, highlight on pawn square
    console.log(player.get_number()); console.log(player.get_board_pos());
    $("#player-title" + player.get_number()).attr("class", "player-title-invert");
    $("#" + player.get_board_pos()).attr("class", "ref-cell-square square-lighter");
}

function unhighlight_old_pos(oldId) {
    $("#" + oldId).attr("class", "ref-cell-square");
}


function move_pawn(oldId,newId,color) {
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


function set_w2_keypress(currPlayer,w1Id) {
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
function wall_point_orientation(parseId) {
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
function select_wall_segment(newId) {
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

function unselect_wall_segment(newId) {
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

function status_remove_wall(currPlayer) {
    let nextWallDiv = $("#p" + currPlayer.get_number() + "w" +currPlayer.get_wall_count());
    console.log("selected: " + "#p" + currPlayer.get_number() + "w" +currPlayer.get_wall_count());
    nextWallDiv.attr("class", "wall-indicator-off");
    //exit
}


/* On Side-Effect Functions */

//Attach hover mouse events to every square <div>
function hover_square_on() {
    $('div[id^="sq-"]').hover(function() {
        $(this).attr("class", "ref-cell-square square-lighter");
      }, function() {
        $(this).attr("class", "ref-cell-square");
      });
}

//Attach hover mouse events to every wall <div>
function hover_wall_on() {
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
    function main_click_on(currPlayer) {
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
function keydown_off() {
    $("body").off("keydown");
}

function main_click_off_squares() {
    $('div[id^="sq-"]').off("click");
}

function main_click_off_walls() {
    $('div[id^="wa-"]').off("click");
}

function hover_square_off() {
    $('div[id^="sq-"]').off("mouseenter mouseleave");
}

// [!!!]  Any placed wall segment must be ignored.
function hover_wall_off() {
    $('div[id^="wa-"]').off("mouseenter mouseleave");
}

function status_box_off() {
    $('div[id^="player-title"]').attr("class", "player-title");
}


