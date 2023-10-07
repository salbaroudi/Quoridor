//Keep these global, they will be used a lot!
const bluePawnImg = $('<img />', {
    id: 'bluepawn',
    src: './img/blue_pawn_rs_small.png',
    });
const orangePawnImg = $('<img />', {
    id: 'orangepawn',
    src: './img/orange_pawn_rs_small.png',
    });


//Mainly deal with the status side bar, and set everything up.
//[!!!] Need a single place pawn function that is called for each player.
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
//[!!!] 
function setup_board(p1start,p2start) {
    const blueCell = $("#" + p1start);
    const orangeCell = $("#" + p2start);
    bluePawnImg.appendTo(blueCell);
    orangePawnImg.appendTo(orangeCell);
}

function gen_image_code(color) {
    let htmlCode = "";
    switch(color) {
        case "blue":
            htmlCode = "<img id='blue-pawn' src='./img/blue_pawn_rs.png' />";
            break;
        case "orange":
            htmlCode = "<img id='orange-pawn' src='./img/orange_pawn_rs.png' />";
            break;
        case "green":
            htmlCode = "<img id='green-pawn' src='./img/green_pawn_rs.png' />";
            break;
        case "purple":
            htmlCode = "<img id='purple-pawn' src='./img/purple_pawn_rs.png' />";
            break;
        default:
            console.error("Error: Image color not recognized!");
        }
    return htmlCode;
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

function status_box_off() {
    $('div[id^="player-title"]').attr("class", "player-title");
}

function hover_square_on() {
    $('div[id^="sq-"]').hover(function() {
        $(this).attr("class", "ref-cell-square square-lighter");
      }, function() {
        $(this).attr("class", "ref-cell-square");
      });
    return;
}
//we actually cant do a class change trick, because we have two types of wall (!)
function hover_wall_on() {
    $('div[id^="wa-"]').hover(function() {
        $(this).css('background-color', '#0000E1'); // Example: Change background color
      }, function() {
        $(this).css('background-color', '#000096'); // Example: Reset background color
      });
    return;
}

//Called from app which is loaded by <script> after ui..., 
//but JS does not have issues with mutual dependencies between two files (app and ui). 

function main_click_on(currPlayer) {
    //Before we do anything, we need to clear our old click events.
    //If we don't do this, multiple click events build up and we get many turns taken at once.
    main_click_off_squares();
    main_click_off_walls();
    //Attach only one set of events.
    $('div[id^="sq-"]').click(function() { player_click_move(currPlayer,$(this).attr("id"))});
    $('div[id^="wa-"]').click(function() { player_click_wall(currPlayer,$(this).attr("id"))});
}

function set_w2_keypress(currPlayer,w1Id) {
    //Clean up old events, again.
    main_click_off_walls();
    //just leave the hover events on for now
    // add keyboard scan and onclick for each wall, again.
    $("body").keydown(function(event) { keyboard_escape(event,currPlayer)});
    $('div[id^="wa-"]').click(function() { second_wall_click(currPlayer,w1Id,$(this).attr("id"))});
}

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

function select_wall_segment(newId) {
    //Need to check if its a vertical or horizontal wall, and act accordingly.
    let result = wall_point_orientation(newId);
    let classes = "";

    if (result == "horizontal") { classes = "ref-cell-b-wall wall-lightest";}
    else if (result == "vertical") { classes = "ref-cell-r-wall wall-lightest";}
    $("#" + newId).attr("css", classes);
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



