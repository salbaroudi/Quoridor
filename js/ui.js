class UIChanges {
        constructor() {}

    //Mainly deal with the status side bar, and set everything up.
    static start_game_request(p1name,p2name) {
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
    static setup_board(p1start,p2start) {
        const bluePawn = $('<img />', {
            id: 'bluepawn',
            src: './img/blue_pawn_rs_small.png',
         });
        const orangePawn = $('<img />', {
            id: 'orangepawn',
            src: './img/orange_pawn_rs_small.png',
         });
        const blueCell = $("#" + p1start);
        const orangeCell = $("#" + p2start);
        bluePawn.appendTo(blueCell);
        orangePawn.appendTo(orangeCell);
    }

    static gen_image_code(color) {
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
}


