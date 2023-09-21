class UIChanges {
    constructor() {}

    //Mainly deal with the status side bar, and set everything up.
    static start_game_request(p1name,p2name) {
        //hide the start game console.
        $("#connect-container").attr("class",
        "connect-container-hidden " + $("#connect-container").attr("class"));
        //Make Player1 and Player2 visible.
        console.log(p1name);
        console.log($("#player-title1").html());
        $("#player-title1").html("Player 1: " + p1name);
        $("#player-title2").html("Player 2: " + p2name);
        $("#player1").attr("class", "player-stats");
        $("#player2").attr("class", "player-stats");
    }

    //Place our pieces on the board
    static setup_board(p1start,p2start) {
        //Grab board div, insert an image. in each slot.
        var myImg = $('<img />', {
            id: 'bluepawn',
            src: './img/blue_pawn_rs.png',
            alt: 'Alt text'
         });
        $("#0.4").html(myImg);
        //$("#0.6").html(UIChanges.gen_image_code("orange"));
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


