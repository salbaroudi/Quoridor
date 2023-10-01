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
// TFG!!
function click_square_on() {
    $('div[id^="sq-"]').click(player_clicked_square());
    return;
}
//we actually cant do a class change trick, because we have two types of wall (!)
function click_wall_on() {
    $('div[id^="wa-"]').hover(function() {
        $(this).css('background-color', '#0000E1'); // Example: Change background color
      }, function() {
        $(this).css('background-color', '#000096'); // Example: Reset background color
      });
    return;
}



function hover_square_off() {
    $('div[id^="sq-"]').off("mouseenter mouseleave");
}

function hover_wall_off() {
    $('div[id^="wa-"]').off("mouseenter mouseleave");
}




