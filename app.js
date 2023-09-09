//Lets create our state objects, using JS constructors.


//Global State Object
function State(tstamp) {
    this.timestamp = tstamp;
    this.turn_count = 0;
    this.p_count = 0;
    this.p_queue = [];
    this.curr_player = 1;

    addPlayer = function (player) {
        this.p_queue.push(player);
    }

    nextPlayer = function() {
        let next = this.p_queue.shift();
        this.p_queue.push(next);
        return next;
    }
}


//Player Object
function Player(shipname, pnum) {
    this.name = shipname;
    this.p_number = pnum;
    this.path_list = new PathList();
    this.wall_list = new WallList();
    this.wall_count = 4;
    this.board_pos = 0.0;
}

function PathList() {
    this.path_list = [];
    
    getpathlist = function() {
        
    }
}

let GameState = new State(Date.now());
GameState.addPlayer(new Player("~sampel-palnet", 1));
GameState.addPlayer(new Player("~docdyl-todsup", 2));
GameState.addPlayer(new Player("~sorrec-livtul", 3));
GameState.addPlayer(new Player("~haptul-morroc",4));
