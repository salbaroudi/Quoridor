/*
Global State Object

This stores the entire state of the game. It also references other classes that control various aspects and components of the game.

Fields:
- Timestamp: this references a unique timestamp to make our current game unique.
- Turn_Count: Simply counts how many turns have elapsed so far.
- P_Queue: Used to determine the next players turn. An object data-structure that should not be mutated directly.
- Curr_Player: Gives the integer value of the player (Player 1, 2, 3...)
- Wall_List: stores a list of all placed walls in the game.

*/
class State {
    //This is run when the App initializes.
    constructor() {
        //Initialization value in time.
        this.Timestamp = Date.now();
        this.Turn_Count = 0;
        //Player Queue.
        this.P_Queue = [];
        this.Wall_List = new WallList();
        //Player running this particular app.
        this.Curr_Player = 0;  //Defaults to zero (need to negotiate session first).
        this.Num_Players = 0; // ""
    }

    add_player(player) {
        if (!(player instanceof Player)) {
            console.error("Error: addPlayer - input not a Player Object");
        }
        this.P_Queue.push(player);
    }

    //Get the next player. Do not mutate directly. Use this.
    next_player() {
        let next = this.P_Queue.shift();
        this.P_Queue.push(next);
        return next;
    }

    turncount_incr() {
        this.Turn_Count = this.Turn_Count + 1;
    }

    numplayers_incr() {
        this.Num_Players = this.Num_Players + 1;
    }

}
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
class Player {
    //Use player init function to initialize properly. Initialized after session negotiation.
    constructor(shipName) {
        this.Name = shipName;  //Immutable Propeties - set on Init.
        this.P_Number = tuple[0]; this.Colour = tuple[1];
        this.Wall_Count = tuple[2];  //Mutable Properties
        this.Board_Pos = tuple[3];
        this.Wall_List = new WallList();
    }

    //Input: string of format "X.Y" where X and Y are whole numbers in board range.
    update_board_pos(pos) {
        if (!(typeof pos === "string")) {
            console.error("Error: Board position update not a string. Check input.");
        }
        this.Board_Pos = pos;
    }

    /*
        Wall Format: "<start pos>,<end pos>".
        When the user is selecting a wall, we check if its a valid wall there.
        By this point, we assume that we are inputting a valid wall, and check the formatting only.
    */
    push_wall_list(wall) {
        //Error checking here [!!!]
        this.Wall_List.push(wall);
    }

    get_wall_list() {
        return this.Wall_List;
    }

    wall_count_dec() {
        this.Wall_Count = this.Wall_Count  - 1;
        if (this.Wall_Count <= 0) {
            console.error("Error: Wall Count decrement at wc = 0. Error in Game State.");
        }
    }


}
function WallList() {
    this.Wall_List = [];
    this.Unused_Walls = 8;
    this.getpathlist = function() {
        return [];
    }

    this.addWall = function(p1,p2) {

    }
}

let GameState = new State();
GameState.addplayer(new Player("~sampel-palnet", playerinit(1)));
GameState.addplayer(new Player("~docdyl-todsup",  playerinit(2)));
GameState.addplayer(new Player("~sorrec-livtul",  playerinit(3)));
GameState.addplayer(new Player("~haptul-morroc", playerinit(4)));
