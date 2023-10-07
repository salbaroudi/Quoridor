
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

    get_wall_list() {
        return this.Wall_List;
    }

    //Number of Players field set after add_player finishes.
    add_player(player) {
        if (!(player instanceof Player)) {
            console.error("Error: addPlayer - input not a Player Object");
        }
        this.P_Queue.push(player);
        this.update_num_players();
    }

    //Called for this instance. Must set the Curr_Player field.
    add_this_player (player) {
        if (!(player instanceof Player)) {
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
 class Player {
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

 class WallList {
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
