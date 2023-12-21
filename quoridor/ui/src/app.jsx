import React, { useEffect, useState, useReducer } from 'react'
import Urbit from '@urbit/http-api'
import $ from 'jquery';

//At least in VS Code, some of the imports below are highlighted as not used.
//They *are* used - by Rollup to knit everything together. Ignore such warnings.
import {GameState, GamePlayer, playerinit, Wall_List,
setup_left_console, setup_help_box, wall_point_orientation, 
player_status_init,toggle_player_status, unhighlight_old_pos, 
unselect_wall_segment, select_wall_segment, status_remove_wall, 
hover_square_on, hover_wall_on, keydown_off, main_click_off_squares,
main_click_off_walls, hover_square_off, hover_wall_off, status_box_off, 
check_pawn_move,log_to_console, log_turn_start} from "./public/js/megafile.js"

const api = new Urbit( '', '', window.desk )
api.ship = window.ship

//This isn't used for now, as Quridors state is separate.
function reducer( state, action ) {
  let newState = [ ...state ]
  switch ( action.type ) {
    case 'init':
      console.log(action.init)
      return action.init
    default:
      console.log("Warning: Unrecognized action detected. Check code.")
      return state
  }
}

export function App() {
    const [ state, dispatch ] = useReducer( reducer, [] )
  const [ inputValue, setInputValue ] = useState( "" )

  //Application starts-up here.
  //We don't go through action.hoon, because we are doing a subscribe.
  useEffect(() => {
    function init() {  
      api.reset()
      api.subscribe( { app:"quoridor", path: '/qsub-frontend', event: handleUpdate } )
    }
    init()
    initializeGame()
  }, [] )

//Here we grab our values from the subscribe wire. But we don't send actions to the reducer.
//Instead, handleUpdate dispatches our jQuery Quoridor functions to do the work.
  const handleUpdate = ( upd ) => {
    if ( 'init' in upd ) {
      console.log("FE has started up.")
      console.log(upd)
      return  //don't call main_control_loop() yet!
    }
    else if ('okmove' in upd) {
      console.log("%okmove from BE recieved: "  + upd.okmove.player)
      console.log(upd)
      let sqID = "sq-" + upd.okmove.posrow + "-" + upd.okmove.poscol
      process_move(currPlayer, sqID)
    }
    else if ('intmove' in upd) {
      console.log("%intmove recieved from other players BE:")
      console.log(upd)
      process_move(currPlayer,"sq-" + upd.intmove.posrow + "-" + upd.intmove.poscol) //this should just do it all!
    }
    else if ('intwall' in upd) {
      console.log("intwall recieved:")
      console.log(upd)
      //form our wall segment one and two.
      let w1Id = "wa-" + upd.intwall.w1p1 + "-" +  upd.intwall.w1p2;
      let w2Id = "wa-" + upd.intwall.w2p1 + "-" +  upd.intwall.w2p2;
      select_wall_segment(w1Id);
      process_walls(currPlayer,w1Id,w2Id) 
    }
    else if ('okwall' in upd) {
      console.log("Gall Response: Accepted Wall Placement:")
      console.log(upd)
    }
    else if ("festart" in upd) {
      console.log("successfully detected the start of the game. handshake and setup complete!")
      set_init_game_state(upd.festart.p1, upd.festart.p2)
      return
    }
    //most cases roll off the branch, and call m_c_l().
    main_control_loop();  
  }

  const sendmove = (r,c,playnum) => {
    api.poke( {
      app: 'quoridor',
      mark: 'quoridor-action',
      json: { pawnmove: { target:`~${window.ship}`, pos: {row:r, col:c}, pnum:playnum}},
    } )
  }
//Rollup/React don't minify this function properly. If I name the input things like "wpr1", it doesn't
//change the variable names in the innermost json. I have no idea why.
//So simple lettering it is ¯\_(ツ)_/¯
//In other news, I started worrying and learned to hate code minification+bundling ;( .
  const wallmove = (a,b,c,d,pnum) => {
    api.poke( {
      app: 'quoridor',
      mark: 'quoridor-action',
      json: { wallmove: { 
        target:`~${window.ship}`,
        pnum:pnum,
         wp1: {
          row:a, 
          col:b}, 
        wp2:{
          row:c, 
          col:d}}},
    })
  }

  //This callback initializes our handshake between two players.
  const hellosub = (p2) => {
    api.poke( {
      app: 'quoridor',
      mark: 'quoridor-action',
      json: { hellosub: {target: p2}
    } }) }
  
//---------- QApp Control State and Functions Below:

  var quorGameState;
  var currPlayer;

function initializeGame() {
  quorGameState = new GameState();
  setup_left_console();
  setup_help_box();
  $(".send-request-button").on( "click", start_game_request);
  log_to_console("Please enter an @p in the [Username] box to begin...");
}

  /*
    Game starts when user enters @p and hits Send Request button.
  */
function start_game_request() {
  let p2name = $("#at-p").val();

  //simple check:  name formatting
  //(p2name[0] == "~") && (p2name[7] == "-") && (p2name.length == 14)
  //reminder: get node.js @p checker from github
  if (true) {
      hellosub(p2name);  //send our request to the Gall App.
  }
  else { 
    log_to_console("Invalid @p detected. Check your spelling and try again.");
    return;
  }
}
  
//Once our server has been reset, we can initialize our game
function set_init_game_state(p1name,p2name) {
  quorGameState.add_player(new GamePlayer(p1name, playerinit(1)));
  quorGameState.add_player(new GamePlayer(p2name, playerinit(2)));
  //update status container UI.
  player_status_init(p1name,p2name);
  console.log(quorGameState);
  setup_board(playerinit(1)[3],playerinit(2)[3]);
  log_to_console("Game Start!");
  main_control_loop();
}

//This function coordinates state control, network effects, and 
//feeds data structure information into megafile.js functions
//Re-Entry Point 1: Previous move was valid.
function main_control_loop() {
  currPlayer = quorGameState.next_player();
  log_turn_start(quorGameState.get_turncount(), currPlayer.get_ship_name());
  //sets the orange name bar at bottom of screen.
  toggle_player_status(currPlayer);

  //This allows us to enter the next stage of the functional loop.
  //There are three move states: A complete piece move, a complete wall move, and a cancelled
  //wall move. For the cancelled move, we call h_and_c(), else, we call main_control_loop to restart a loop.
  //Re-Entry Point 2 (Invalid move made previously)
  if (currPlayer.Name == ('~' + `${window.ship}`)) {
    hovers_and_clicks(currPlayer);
  }
  else {  //Deactivate the board. User waits.
    main_click_off_squares()
    main_click_off_walls()
    hover_square_off()
    hover_wall_off()
    log_to_console(`${window.ship}`  + " is waiting...")
  }
}

/*
    These side-effects needed to be bundled together, because
    we can prematurely exit from the Wall Movement code.
    A player can press the [ESC] key to cancel, or click the wrong
    wall for its second point. So we have to reset the players move 
    without calling next_player().
*/
function hovers_and_clicks(currPlayer) {
  hover_square_on();
  //hover_wall_on();  was buggy, disabled.
  main_click_on(currPlayer);
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
      $('div[id^="wa-"]').click(function() { console.log(currPlayer.get_ship_name() +  " has run out of walls. Please move pawn to complete move.")});            
  }
}
function player_click_move(currPlayer,newId) {
  //A move is validated after the BE sends an %ok or %int response, not before.
  send_player_move(newId,currPlayer.get_number());
}

//updates the board and data structures, after an %ok or %int has been recieved by updateHandler.
function process_move(currPlayer,newId)  {
    const oldId = currPlayer.get_board_pos();
    unhighlight_old_pos(oldId);
    check_pawn_move(oldId,newId);
    move_pawn(oldId,newId,currPlayer.get_colour());
    currPlayer.update_board_pos(newId);
    log_to_console(currPlayer.get_ship_name() + "has moved to square: " + newId);
}

function player_click_wall(currPlayer, newId) {
  //First, deactivate all click moves for squares.
  main_click_off_squares();
  hover_square_off();
  //highlight wall next
  set_w2_keypress(currPlayer,newId);
  select_wall_segment(newId);
  //Now we wait - player presses [ESC], or chooses a second wall.
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

function second_wall_click(currPlayer,w1Id,w2Id) {
  //If we get here, we construct our wall from the two points, add it, print it to console, 
  log_to_console(currPlayer.get_ship_name() + " has placed a wall.");

  //Clean up all events.
  main_click_off_walls();
  hover_square_off();
  //hover_wall_off();
  keydown_off();

  //A bunch of functionality put in a function, to assist the %intmove update processing.
  process_walls(currPlayer,w1Id,w2Id);

  //Intermediate function in order to process input.
  send_player_wall(w1Id,w2Id,currPlayer.get_number());
}

//Remember: This doesn't process the first segment, because of the way the 
//wall action functions are chained (see above). You need to call select_wall_segment()
//for segment one, manually.
function process_walls(currPlayer,w1Id,w2Id) {
  select_wall_segment(w2Id);
  quorGameState.get_wall_list().push_new_wall(w1Id,w2Id);

  //A wall has been used, now take away a wall from a player
  status_remove_wall(currPlayer);
  //This must be done after status_remove_wall()
  currPlayer.decr_wall_count();
}

function keyboard_abort(currPlayer,id) {
//If we get here, we need to reset everything and go back to player click move
  log_to_console("[ESC] key pressed. Aborting move.");
  //remove all click events
  //hover_wall_off();
  keydown_off();
  unselect_wall_segment(id);

  //reset turn loop without changing player. This player still needs to move.
  hovers_and_clicks(currPlayer);
}

function send_player_move(square,pnum) {
  sendmove(parseInt(square.split("-")[1]),parseInt(square.split("-")[2]),pnum);
}


function send_player_wall(wp1,wp2,pnum) {
    wallmove(parseInt(wp1.split("-")[1]),
    parseInt(wp1.split("-")[2]),
    parseInt(wp2.split("-")[1]),
    parseInt(wp2.split("-")[2]),
    pnum); 
}

function setup_board(p1start,p2start) {  
  $("<div class='bluepawn'> [&#9673;] </div>").appendTo("#" + p1start);
  $("<div class='orangepawn'> [&#9673;] </div>").appendTo("#" + p2start);
}

function move_pawn(oldId,newId,color) {
  const oldCell = $("#" + oldId);
  const newCell = $("#" + newId);

  let pPawn = $("<div class='bluepawn'> [&#9673;] </div>");
  if (color == "orange") {
    pPawn = $("<div class='orangepawn'> [&#9673;] </div>");
  }
  oldCell.empty();
  pPawn.appendTo("#" + newId);
  //remove old square highlight.
  oldCell.attr("css", "ref-cell-square");
  newCell.attr("css", "ref-cell-square");
}

//A lot of squares and boxes lie below... :S
  return (
    <main className="">
        <div class="main-container">
          <div class="excelfont"><b> Quoridor </b></div>
          <div class="board-container">
          <div class="ref-cell-container"> 
            <div id="80" class="ref-cell-grid">
              <div id="sq-16-0" class="ref-cell-square"></div> 
              <div id="wa-16-1" class="ref-cell-r-wall"></div> 
              <div id="wa-15-0" class="ref-cell-b-wall"></div> 
            </div>
            <div id="81" class="ref-cell-grid">
              <div id="sq-16-2" class="ref-cell-square"></div> 
              <div id="wa-16-3" class="ref-cell-r-wall"></div> 
              <div id="wa-15-2" class="ref-cell-b-wall"></div> 
            </div>
            <div id="82" class="ref-cell-grid">
              <div id="sq-16-4" class="ref-cell-square"></div> 
              <div id="wa-16-5" class="ref-cell-r-wall"></div> 
              <div id="wa-15-4" class="ref-cell-b-wall"></div> 
            </div>
            <div id="83" class="ref-cell-grid">
              <div id="sq-16-6" class="ref-cell-square"></div> 
              <div id="wa-16-7" class="ref-cell-r-wall"></div> 
              <div id="wa-15-6" class="ref-cell-b-wall"></div> 
            </div>
            <div id="84" class="ref-cell-grid">
              <div id="sq-16-8" class="ref-cell-square"></div> 
              <div id="wa-16-9" class="ref-cell-r-wall"></div> 
              <div id="wa-15-8" class="ref-cell-b-wall"></div> 
            </div>
            <div id="85" class="ref-cell-grid">
              <div id="sq-16-10" class="ref-cell-square"></div> 
              <div id="wa-16-11" class="ref-cell-r-wall"></div> 
              <div id="wa-15-10" class="ref-cell-b-wall"></div> 
            </div>
            <div id="86" class="ref-cell-grid">
              <div id="sq-16-12" class="ref-cell-square"></div> 
              <div id="wa-16-13" class="ref-cell-r-wall"></div> 
              <div id="wa-15-12" class="ref-cell-b-wall"></div> 
            </div>
            <div id="87" class="ref-cell-grid">
              <div id="sq-16-14" class="ref-cell-square"></div> 
              <div id="wa-16-15" class="ref-cell-r-wall"></div> 
              <div id="wa-15-14" class="ref-cell-b-wall"></div> 
            </div>
            <div id="88" class="ref-cell-grid">
              <div id="sq-16-16" class="ref-cell-square"></div> 
              <div id="wa-15-16" class="ref-cell-b-wall"></div> 
            </div>
    


              <div id="70" class="ref-cell-grid">
                <div id="sq-14-0" class="ref-cell-square"></div> 
                <div id="wa-14-1" class="ref-cell-r-wall"></div> 
                <div id="wa-13-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="71" class="ref-cell-grid">
                <div id="sq-14-2" class="ref-cell-square"></div> 
                <div id="wa-14-3" class="ref-cell-r-wall"></div> 
                <div id="wa-13-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="72" class="ref-cell-grid">
                <div id="sq-14-4" class="ref-cell-square"></div> 
                <div id="wa-14-5" class="ref-cell-r-wall"></div> 
                <div id="wa-13-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="73" class="ref-cell-grid">
                <div id="sq-14-6" class="ref-cell-square"></div> 
                <div id="wa-14-7" class="ref-cell-r-wall"></div> 
                <div id="wa-13-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="74" class="ref-cell-grid">
                <div id="sq-14-8" class="ref-cell-square"></div> 
                <div id="wa-14-9" class="ref-cell-r-wall"></div> 
                <div id="wa-13-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="75" class="ref-cell-grid">
                <div id="sq-14-10" class="ref-cell-square"></div> 
                <div id="wa-14-11" class="ref-cell-r-wall"></div> 
                <div id="wa-13-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="76" class="ref-cell-grid">
                <div id="sq-14-12" class="ref-cell-square"></div> 
                <div id="wa-14-13" class="ref-cell-r-wall"></div> 
                <div id="wa-13-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="77" class="ref-cell-grid">
                <div id="sq-14-14" class="ref-cell-square"></div> 
                <div id="wa-14-15" class="ref-cell-r-wall"></div> 
                <div id="wa-13-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="78" class="ref-cell-grid">
                <div id="sq-14-16" class="ref-cell-square"></div> 
                <div id="wa-13-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="60" class="ref-cell-grid">
                <div id="sq-12-0" class="ref-cell-square"></div> 
                <div id="wa-12-1" class="ref-cell-r-wall"></div> 
                <div id="wa-11-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="61" class="ref-cell-grid">
                <div id="sq-12-2" class="ref-cell-square"></div> 
                <div id="wa-12-3" class="ref-cell-r-wall"></div> 
                <div id="wa-11-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="62" class="ref-cell-grid">
                <div id="sq-12-4" class="ref-cell-square"></div> 
                <div id="wa-12-5" class="ref-cell-r-wall"></div> 
                <div id="wa-11-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="63" class="ref-cell-grid">
                <div id="sq-12-6" class="ref-cell-square"></div> 
                <div id="wa-12-7" class="ref-cell-r-wall"></div> 
                <div id="wa-11-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="64" class="ref-cell-grid">
                <div id="sq-12-8" class="ref-cell-square"></div> 
                <div id="wa-12-9" class="ref-cell-r-wall"></div> 
                <div id="wa-11-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="65" class="ref-cell-grid">
                <div id="sq-12-10" class="ref-cell-square"></div> 
                <div id="wa-12-11" class="ref-cell-r-wall"></div> 
                <div id="wa-11-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="66" class="ref-cell-grid">
                <div id="sq-12-12" class="ref-cell-square"></div> 
                <div id="wa-12-13" class="ref-cell-r-wall"></div> 
                <div id="wa-11-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="67" class="ref-cell-grid">
                <div id="sq-12-14" class="ref-cell-square"></div> 
                <div id="wa-12-15" class="ref-cell-r-wall"></div> 
                <div id="wa-11-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="68" class="ref-cell-grid">
                <div id="sq-12-16" class="ref-cell-square"></div> 
                <div id="wa-11-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="50" class="ref-cell-grid">
                <div id="sq-10-0" class="ref-cell-square"></div> 
                <div id="wa-10-1" class="ref-cell-r-wall"></div> 
                <div id="wa-9-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="51" class="ref-cell-grid">
                <div id="sq-10-2" class="ref-cell-square"></div> 
                <div id="wa-10-3" class="ref-cell-r-wall"></div> 
                <div id="wa-9-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="52" class="ref-cell-grid">
                <div id="sq-10-4" class="ref-cell-square"></div> 
                <div id="wa-10-5" class="ref-cell-r-wall"></div> 
                <div id="wa-9-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="53" class="ref-cell-grid">
                <div id="sq-10-6" class="ref-cell-square"></div> 
                <div id="wa-10-7" class="ref-cell-r-wall"></div> 
                <div id="wa-9-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="54" class="ref-cell-grid">
                <div id="sq-10-8" class="ref-cell-square"></div> 
                <div id="wa10-9" class="ref-cell-r-wall"></div> 
                <div id="wa-9-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="55" class="ref-cell-grid">
                <div id="sq-10-10" class="ref-cell-square"></div> 
                <div id="wa-10-11" class="ref-cell-r-wall"></div> 
                <div id="wa-9-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="56" class="ref-cell-grid">
                <div id="sq-10-12" class="ref-cell-square"></div> 
                <div id="wa-10-13" class="ref-cell-r-wall"></div> 
                <div id="wa-9-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="57" class="ref-cell-grid">
                <div id="sq-10-14" class="ref-cell-square"></div> 
                <div id="wa-10-15" class="ref-cell-r-wall"></div> 
                <div id="wa-9-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="58" class="ref-cell-grid">
                <div id="sq-10-16" class="ref-cell-square"></div> 
                <div id="wa-9-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="40" class="ref-cell-grid">
                <div id="sq-8-0" class="ref-cell-square"></div> 
                <div id="wa-8-1" class="ref-cell-r-wall"></div> 
                <div id="wa-7-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="41" class="ref-cell-grid">
                <div id="sq-8-2" class="ref-cell-square"></div> 
                <div id="wa-8-3" class="ref-cell-r-wall"></div> 
                <div id="wa-7-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="42" class="ref-cell-grid">
                <div id="sq-8-4" class="ref-cell-square"></div> 
                <div id="wa-8-5" class="ref-cell-r-wall"></div> 
                <div id="wa-7-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="43" class="ref-cell-grid">
                <div id="sq-8-6" class="ref-cell-square"></div> 
                <div id="wa-8-7" class="ref-cell-r-wall"></div> 
                <div id="wa-7-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="44" class="ref-cell-grid">
                <div id="sq-8-8" class="ref-cell-square"></div> 
                <div id="wa-8-9" class="ref-cell-r-wall"></div> 
                <div id="wa-7-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="45" class="ref-cell-grid">
                <div id="sq-8-10" class="ref-cell-square"></div> 
                <div id="wa-8-11" class="ref-cell-r-wall"></div> 
                <div id="wa-7-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="46" class="ref-cell-grid">
                <div id="sq-8-12" class="ref-cell-square"></div> 
                <div id="wa-8-13" class="ref-cell-r-wall"></div> 
                <div id="wa-7-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="47" class="ref-cell-grid">
                <div id="sq-8-14" class="ref-cell-square"></div> 
                <div id="wa-8-15" class="ref-cell-r-wall"></div> 
                <div id="wa-7-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="48" class="ref-cell-grid">
                <div id="sq-8-16" class="ref-cell-square">
                </div> 
                <div id="wa-7-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="30" class="ref-cell-grid">
                <div id="sq-6-0" class="ref-cell-square"></div> 
                <div id="wa-6-1" class="ref-cell-r-wall"></div> 
                <div id="wa-5-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="31" class="ref-cell-grid">
                <div id="sq-6-2" class="ref-cell-square"></div> 
                <div id="wa-6-3" class="ref-cell-r-wall"></div> 
                <div id="wa-5-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="32" class="ref-cell-grid">
                <div id="sq-6-4" class="ref-cell-square"></div> 
                <div id="wa-6-5" class="ref-cell-r-wall"></div> 
                <div id="wa-5-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="33" class="ref-cell-grid">
                <div id="sq-6-6" class="ref-cell-square"></div> 
                <div id="wa-6-7" class="ref-cell-r-wall"></div> 
                <div id="wa-5-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="34" class="ref-cell-grid">
                <div id="sq-6-8" class="ref-cell-square"></div> 
                <div id="wa-6-9" class="ref-cell-r-wall"></div> 
                <div id="wa-5-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="35" class="ref-cell-grid">
                <div id="sq-6-10" class="ref-cell-square"></div> 
                <div id="wa-6-11" class="ref-cell-r-wall"></div> 
                <div id="wa-5-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="36" class="ref-cell-grid">
                <div id="sq-6-12" class="ref-cell-square"></div> 
                <div id="wa-6-13" class="ref-cell-r-wall"></div> 
                <div id="wa-5-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="37" class="ref-cell-grid">
                <div id="sq-6-14" class="ref-cell-square"></div> 
                <div id="wa-6-15" class="ref-cell-r-wall"></div> 
                <div id="wa-5-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="38" class="ref-cell-grid">
                <div id="sq-6-16" class="ref-cell-square"></div> 
                <div id="wa-5-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="20" class="ref-cell-grid">
                <div id="sq-4-0" class="ref-cell-square"></div> 
                <div id="wa-4-1" class="ref-cell-r-wall"></div> 
                <div id="wa-3-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="21" class="ref-cell-grid">
                <div id="sq-4-2" class="ref-cell-square"></div> 
                <div id="wa-4-3" class="ref-cell-r-wall"></div> 
                <div id="wa-3-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="22" class="ref-cell-grid">
                <div id="sq-4-4" class="ref-cell-square"></div> 
                <div id="wa-4-5" class="ref-cell-r-wall"></div> 
                <div id="wa-3-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="23" class="ref-cell-grid">
                <div id="sq-4-6" class="ref-cell-square"></div> 
                <div id="wa-4-7" class="ref-cell-r-wall"></div> 
                <div id="wa-3-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="24" class="ref-cell-grid">
                <div id="sq-4-8" class="ref-cell-square"></div> 
                <div id="wa-4-9" class="ref-cell-r-wall"></div> 
                <div id="wa-3-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="25" class="ref-cell-grid">
                <div id="sq-4-10" class="ref-cell-square"></div> 
                <div id="wa-4-11" class="ref-cell-r-wall"></div> 
                <div id="wa-3-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="26" class="ref-cell-grid">
                <div id="sq-4-12" class="ref-cell-square"></div> 
                <div id="wa-4-13" class="ref-cell-r-wall"></div> 
                <div id="wa-3-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="27" class="ref-cell-grid">
                <div id="sq-4-14" class="ref-cell-square"></div> 
                <div id="wa-4-15" class="ref-cell-r-wall"></div> 
                <div id="wa-3-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="28" class="ref-cell-grid">
                <div id="sq-4-16" class="ref-cell-square"></div> 
                <div id="wa-3-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="10" class="ref-cell-grid">
                <div id="sq-2-0" class="ref-cell-square"></div> 
                <div id="wa-2-1" class="ref-cell-r-wall"></div> 
                <div id="wa-1-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="11" class="ref-cell-grid">
                <div id="sq-2-2" class="ref-cell-square"></div> 
                <div id="wa-2-3" class="ref-cell-r-wall"></div> 
                <div id="wa-1-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="12" class="ref-cell-grid">
                <div id="sq-2-4" class="ref-cell-square"></div> 
                <div id="wa-2-5" class="ref-cell-r-wall"></div> 
                <div id="wa-1-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="13" class="ref-cell-grid">
                <div id="sq-2-6" class="ref-cell-square"></div> 
                <div id="wa-2-7" class="ref-cell-r-wall"></div> 
                <div id="wa-1-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="14" class="ref-cell-grid">
                <div id="sq-2-8" class="ref-cell-square"></div> 
                <div id="wa-2-9" class="ref-cell-r-wall"></div> 
                <div id="wa-1-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="15" class="ref-cell-grid">
                <div id="sq-2-10" class="ref-cell-square"></div> 
                <div id="wa-2-11" class="ref-cell-r-wall"></div> 
                <div id="wa-1-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="16" class="ref-cell-grid">
                <div id="sq-2-12" class="ref-cell-square"></div> 
                <div id="wa-2-13" class="ref-cell-r-wall"></div> 
                <div id="wa-1-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="17" class="ref-cell-grid">
                <div id="sq-2-14" class="ref-cell-square"></div> 
                <div id="wa-2-15" class="ref-cell-r-wall"></div> 
                <div id="wa-1-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="18" class="ref-cell-grid">
                <div id="sq-2-16" class="ref-cell-square"></div> 
                <div id="wa-1-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="0" class="ref-cell-grid">
                <div id="sq-0-0" class="ref-cell-square"></div> 
                <div id="wa-0-1" class="ref-cell-r-wall"></div> 
              </div>
              <div id="1" class="ref-cell-grid">
                <div id="sq-0-2" class="ref-cell-square"></div> 
                <div id="wa-0-3" class="ref-cell-r-wall"></div> 
              </div>
              <div id="2" class="ref-cell-grid">
                <div id="sq-0-4" class="ref-cell-square"></div> 
                <div id="wa-0-5" class="ref-cell-r-wall"></div> 
              </div>
              <div id="3" class="ref-cell-grid">
                <div id="sq-0-6" class="ref-cell-square"></div> 
                <div id="wa-0-7" class="ref-cell-r-wall"></div> 
              </div>
              <div id="4" class="ref-cell-grid">
                <div id="sq-0-8" class="ref-cell-square"></div> 
                <div id="wa-0-9" class="ref-cell-r-wall"></div> 
              </div>
              <div id="5" class="ref-cell-grid">
                <div id="sq-0-10" class="ref-cell-square"></div> 
                <div id="wa-0-11" class="ref-cell-r-wall"></div> 
              </div>
              <div id="6" class="ref-cell-grid">
                <div id="sq-0-12" class="ref-cell-square"></div> 
                <div id="wa-0-13" class="ref-cell-r-wall"></div> 
              </div>
              <div id="7" class="ref-cell-grid">
                <div id="sq-0-14" class="ref-cell-square"></div> 
                <div id="wa-0-15" class="ref-cell-r-wall"></div> 
              </div>
              <div id="8" class="ref-cell-grid">
                <div id="sq-0-16" class="ref-cell-square"></div> 
              </div>
            </div>
          </div>

    <div class="status-container">
      <div id="connect-container" class="connect-container">
        <div class="player-title-invert">Start Game: Enter @p to begin...</div>
        <br />
        <div class="connect-box">
          <label class="input-label" for="at-p">Username:</label>
          <input class="input-username" type="text"  id="at-p" />
          <button id="sq-end-request-button" class="send-request-button"> Send Request &#8599;</button>
        </div>
      </div>

      <div id="player-container" class="player-container hidden">
        <div id="player1" class="player-stats">
            <div id="player-title1" class="player-title">Player 1:</div>
            <div class="wall-chart">
              <div id="p1w1" class="wall-indicator-on"> W1</div>
              <div id="p1w2" class="wall-indicator-on">W2</div>
              <div id="p1w3" class="wall-indicator-on">W3</div>
              <div id="p1w4" class="wall-indicator-on">W4</div>
              <div id="p1w5" class="wall-indicator-on">W5</div>
              <div id="p1w6" class="wall-indicator-on">W6</div>
              <div id="p1w7" class="wall-indicator-on">W7</div>
              <div id="p1w8" class="wall-indicator-on">W8</div>
              <div id="p1w9" class="wall-indicator-on">W9</div>
              <div id="p1w10" class="wall-indicator-on">W10</div>
          </div>
        </div>
        <div id="player2" class="player-stats">
            <div id="player-title2" class="player-title">Player 2:</div>
            <div class="wall-chart">
                <div id="p2w1" class="wall-indicator-on"> W1</div>
                <div id="p2w2" class="wall-indicator-on">W2</div>
                <div id="p2w3" class="wall-indicator-on">W3</div>
                <div id="p2w4" class="wall-indicator-on">W4</div>
                <div id="p2w5" class="wall-indicator-on">W5</div>
                <div id="p2w6" class="wall-indicator-on">W6</div>
                <div id="p2w7" class="wall-indicator-on">W7</div>
                <div id="p2w8" class="wall-indicator-on">W8</div>
                <div id="p2w9" class="wall-indicator-on">W9</div>
                <div id="p2w10" class="wall-indicator-on">W10</div>
            </div>
        </div>
      </div>
    </div>


      <button id="toggle-button-console"> &gt;_ </button>
      <div id="console-container" class="console-hidden">
          <pre id="console"></pre>
      </div>

      <button id="toggle-button-help"> ?! </button>
      <div id="help-box" class="console-hidden">
          <b> How to Play:</b>

          <ol>
            <li> Enter an @p in the [Send Request Box] Below</li>
            <li> When your turn starts, you may move your piece one square, or place a wall.</li>
            <li> Placing a wall: Select two wall segments side-by-side, in a vertical or horizontal line. You may press the [Esc] key to cancel wall placement.</li>
            <li> Goal: Get your piece to the other side of the board, before your opponent does so! </li>
            <li> Place walls to lengthen your opponents path. You may <b>not</b> entrap an opponent (they must have a path to the exit at all times).</li>
          </ol>

      </div>
    </div>
    </main>
  )
}

export default App;