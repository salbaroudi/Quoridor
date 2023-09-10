//Lets create our state objects, using JS constructors.
//Global State Object
class State {
    constructor(tstamp) {
        //Initialization value in time.
        this.timestamp = tstamp;
        this.turn_count = 0;
        //Player Queue.
        this.p_queue = [];
        //Player running this particular app.
        this.curr_player = 1;
    }

    addplayer(player) {
        this.p_queue.push(player);
    }

    nextplayer() {
        let next = this.p_queue.shift();
        this.p_queue.push(next);
        return next;
    }
}

//Shortens our constuctor inputs, and makes initialization easier.
//Could also use a map, but this is fixed so w/e.
function playerinit(num) {
    let tuple = 0;
    switch(num) {
        case 1:
            tuple = [1,"blue", 0.4];
            break;
        case 2:
            tuple = [2,"orange", 6.2];
            break;
        case 3:
            tuple = [3,"green", 2.0];
            break;
        case 4:
            tuple = [4,"purple", 4.6];
            break;
        default:
            console.error("Error: Player Number not recognized.");
    }
    return tuple;
}

//Player Object
class Player {
    constructor(shipName, tuple) {
        this.name = shipName;
        this.p_number = tuple[0];
        this.color = tuple[1]
        this.board_pos = tuple[2];
        this.path_list = new PathList(tuple[2]);
        this.wall_list = new WallList();
        this.wall_count = 4;    
    }
}

function PathList(startPos) {
    this.path_list = [];
    this.getpathlist = function() {
        return  this.path_list;
    }

    //Use decimal notation for our square coordinates. X.Y means row X, col Y.
    //The bound parameters will need to be changed for a 9x9 later [!!!]
    this.addPath = function(decimal) {
        let row = -1; let col = -1;
        if ((decimal % 1) != 0) {
            row = Math.floor(decimal);
            col = (decimal % 1).toFixed(2)*10;
        }
        if ((row > -1 &&  row < 7) && (col > -1 && col < 7)) {
            this.path_list.push(decimal);
        }
        else {
            console.error("Error: Invalid square. Did not update path");
        }
    }

    this.returnPath = function(){
        return this.path_list;
    }

    this.getPosition = function(){
        if (this.path_list.length == 0){
            console.log("Error: Path List is empty!");
        }
        return this.path_list.slice(-1);
    }
}

class Rectangle {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
  }

function WallList() {
    this.wall_list = [];
    this.getpathlist = function() {
        return [];
    }

    this.addWall = function(p1,p2) {

    }
}
/*
let GameState = new State(Date.now());
GameState.addPlayer(new Player("~sampel-palnet", 1));
GameState.addPlayer(new Player("~docdyl-todsup", 2));
GameState.addPlayer(new Player("~sorrec-livtul", 3));
GameState.addPlayer(new Player("~haptul-morroc",4));
*/

let GameState = new State(Date.now());
GameState.addplayer(new Player("~sampel-palnet", playerinit(1)));
GameState.addplayer(new Player("~docdyl-todsup",  playerinit(2)));
GameState.addplayer(new Player("~sorrec-livtul",  playerinit(3)));
GameState.addplayer(new Player("~haptul-morroc", playerinit(4)));
