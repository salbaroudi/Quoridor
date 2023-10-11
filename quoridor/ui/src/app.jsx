import React, { useEffect, useState, useReducer } from 'react'
import Urbit from '@urbit/http-api'
//import $ from 'jquery'
//import orangePawnImg from "./public/img/orange_pawn_rs_small.png"
//import bluePawnImg from "./public/img/blue_pawn_rs_small.png"

import {GameState, GamePlayer, Wall_List, playerinit, initializeGame, start_game_request, main_turn_loop, hovers_and_clicks, player_click_move,
player_click_wall, second_wall_click, keyboard_abort, setup_left_console, setup_help_box, player_status_init, 
setup_board, toggle_player_status, unhighlight_old_pos, move_pawn,set_w2_keypress, wall_point_orientation, unselect_wall_segment, 
select_wall_segment, status_remove_wall, hover_square_on, main_click_on,hover_wall_on, keydown_off, main_click_off_squares,
main_click_off_walls, hover_square_off, hover_wall_off, status_box_off,check_pawn_move} from "./public/js/megafile.js"

const api = new Urbit( '', '', window.desk )
api.ship = window.ship

function reducer( state, action ) {
  let newState = [ ...state ]
  switch ( action.type ) {
    case 'init':
      return action.init
    case 'push':
      newState.unshift(action.val)
      return newState
    case 'pop':
      newState.shift()
      return newState
    default:
      console.log("Reached the default case!")
      return state
  }
}

export function App() {
  const [ state, dispatch ] = useReducer( reducer, [] )
  const [ inputValue, setInputValue ] = useState( "" )

  
  useEffect(() => {
    async function init() {  //we don't go through action.hoon, because we are doing a subscribe.
      api.subscribe( { app:"quoridor", path: '/values', event: handleUpdate } )
    }
    init()
    initializeGame()
  }, [] )


  const handleUpdate = ( upd ) => {
    console.log("our update:")
    console.log(upd)
    if ( 'init' in upd ) {
      dispatch({type:'init', init:upd.init.val})
    }
    else if ( 'push' in upd ) {
      dispatch({type:'push', val:upd.push.value})
    }
    else if ( 'pop' in upd ) {
      dispatch( { type:'pop' } )
    }
    else if ( 'move' in upd) {
      dispatch( { type:'move' } )
    }
  }

const jQueryTest = () =>
  {
    console.log("JQuery works...")
    $("#turnred").css("background-color", "red");
}
  const push = () => {
    const val = parseInt( inputValue )
    if ( isNaN( val ) ) return
    api.poke( {
      app: 'quoridor',
      mark: 'quoridor-action',
      json: { push: { target:`~${window.ship}`, value:val } }
    } )
    setInputValue( "" )
  }

  const pop = () => {
    api.poke( {
      app: 'quoridor',
      mark: 'quoridor-action',
      json: { pop: `~${window.ship}` }
    } )
  }

  const move = () => {
    api.poke( {
      app: 'quoridor',
      mark: 'quoridor-action',
      json: { move: { target:`~${window.ship}`, pos: {row:2, col:2}}}
    } )
  }

  //we gen a random wall - doesnt matter if nonsensical.
  const sendwall = () => {
    let r1 = Math.floor(Math.random() * 16);
    let r2 = Math.floor(Math.random() * 16);
    api.poke( {
      app: 'quoridor',
      mark: 'quoridor-action',
      json: { wall: { target:`~${window.ship}`, pos1: {row:r1, col:r2}, pos2:{row:(r1), col:r2+2}}},
    } )
  }

const poke_initplayers = (p1,p2) => {
  api.poke( {
    app: 'quoridor',
    mark: 'quoridor-action',
    json: { sendplayer: { target:`~${window.ship}`, p1name: p1, p2name: p2},
  } })
}

//className=flex flex-col items-center justify-center min-h-screen
  return (
    <main className="">
      <input style={{width:200}} className='border' type='text' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
      <div>
        <button onClick={() => push()} style={{width:100}} className='border p-2 text-black-400'>Push</button>
        <button onClick={() => pop()} style={{width:100}} className='border p-2 text-black-400'>Pop</button>
        <p>Our stack</p>
        {state.map((eachValue, index) => {
          return (<li key={index}>{eachValue}</li>)
        })}
      </div>
      <div class="onerow">
      <button onClick={() => move()} style={{width:100}} className='border p-2 text-black-400'>Send Move</button>
      <button onClick={() => sendwall()} style={{width:100}} className='border p-2 text-black-400'>Send Wall</button>
      </div>

        <br /><hr /><br />


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
                <div id="v10-9" class="ref-cell-r-wall"></div> 
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


      <button id="toggle-button-console"> &gt_ </button>
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