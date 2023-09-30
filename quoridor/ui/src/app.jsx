import React, { useEffect, useState, useReducer } from 'react'
import Urbit from '@urbit/http-api'
import $ from 'jquery'
import orangepawn from "./public/img/orange_pawn_rs_small.png"
import bluepawn from "./public/img/blue_pawn_rs_small.png"

// (!) Doing this, we need to be careful of namespace collisions (!)
//import './public/js/datamodel.js'
//import './public/js/ui.js'
import {playerinit, start_game_request, initializeGame, mainturnLoop,testDSO1} from './public/js/app.js'

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
    console.log(playerinit(2))
  }, [] )


/*  useEffect(() => {
    function init() {
      console.log(aj.playerinit(2))
    }
    init()
  }, [])
*/
  //all acks and data sent back will go through here...
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

const sendplayer = (name) => {
  api.poke( {
    app: 'quoridor',
    mark: 'quoridor-action',
    json: { sendplayer: { target:`~${window.ship}`, pname: name, wcount: 10}}
  } )
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
      <button onClick={() => sendplayer("~nodsup")} style={{width:100}} className='border p-2 text-black-400'>Send P1</button>
      <button onClick={() => sendplayer("~todsup")} style={{width:100}} className='border p-2 text-black-400'>Send P2</button>
      <button id="turnred" onClick={() => jQueryTest()} style={{width:100}} className='border p-2 text-black-400'>jQueryTest</button>
      </div>

        <br /><hr /><br />

      <div class="main-container">
        <div class="excelfont"><b> Quoridor </b></div>
        <div class="board-container">
          <div class="ref-cell-container"> 
              <div id="80" class="ref-cell-grid">
                <div id="c16-0" class="ref-cell-square"></div> 
                <div id="c16-1" class="ref-cell-r-wall"></div> 
                <div id="c15-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="81" class="ref-cell-grid">
                <div id="c16-2" class="ref-cell-square"></div> 
                <div id="c16-3" class="ref-cell-r-wall"></div> 
                <div id="c15-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="82" class="ref-cell-grid">
                <div id="c16-4" class="ref-cell-square"></div> 
                <div id="c16-5" class="ref-cell-r-wall"></div> 
                <div id="c15-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="83" class="ref-cell-grid">
                <div id="c16-4" class="ref-cell-square"></div> 
                <div id="c16-5" class="ref-cell-r-wall"></div> 
                <div id="c15-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="84" class="ref-cell-grid">
                <div id="c16-4" class="ref-cell-square">
                  <img src={orangepawn} />

                </div> 
                <div id="c16-5" class="ref-cell-r-wall"></div> 
                <div id="c15-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="85" class="ref-cell-grid">
                <div id="c16-4" class="ref-cell-square"></div> 
                <div id="c16-5" class="ref-cell-r-wall"></div> 
                <div id="c15-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="86" class="ref-cell-grid">
                <div id="c16-4" class="ref-cell-square"></div> 
                <div id="c16-5" class="ref-cell-r-wall"></div> 
                <div id="c15-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="87" class="ref-cell-grid">
                <div id="c16-4" class="ref-cell-square"></div> 
                <div id="c16-5" class="ref-cell-r-wall"></div> 
                <div id="c15-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="88" class="ref-cell-grid">
                <div id="c16-6" class="ref-cell-square"></div> 
                <div id="c15-6" class="ref-cell-b-wall"></div> 
              </div>


              <div id="70" class="ref-cell-grid">
                <div id="c14-0" class="ref-cell-square"></div> 
                <div id="c14-1" class="ref-cell-r-wall"></div> 
                <div id="c13-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="71" class="ref-cell-grid">
                <div id="c14-2" class="ref-cell-square"></div> 
                <div id="c14-3" class="ref-cell-r-wall"></div> 
                <div id="c13-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="72" class="ref-cell-grid">
                <div id="c14-4" class="ref-cell-square"></div> 
                <div id="c14-5" class="ref-cell-r-wall"></div> 
                <div id="c13-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="73" class="ref-cell-grid">
                <div id="c14-6" class="ref-cell-square"></div> 
                <div id="c14-7" class="ref-cell-r-wall"></div> 
                <div id="c13-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="74" class="ref-cell-grid">
                <div id="c14-8" class="ref-cell-square"></div> 
                <div id="c14-9" class="ref-cell-r-wall"></div> 
                <div id="c13-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="75" class="ref-cell-grid">
                <div id="c14-10" class="ref-cell-square"></div> 
                <div id="c14-11" class="ref-cell-r-wall"></div> 
                <div id="c13-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="76" class="ref-cell-grid">
                <div id="c14-12" class="ref-cell-square"></div> 
                <div id="c14-13" class="ref-cell-r-wall"></div> 
                <div id="c13-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="77" class="ref-cell-grid">
                <div id="c14-14" class="ref-cell-square"></div> 
                <div id="c14-15" class="ref-cell-r-wall"></div> 
                <div id="c13-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="78" class="ref-cell-grid">
                <div id="c14-16" class="ref-cell-square"></div> 
                <div id="c13-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="60" class="ref-cell-grid">
                <div id="c12-0" class="ref-cell-square"></div> 
                <div id="c12-1" class="ref-cell-r-wall"></div> 
                <div id="c11-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="61" class="ref-cell-grid">
                <div id="c12-2" class="ref-cell-square"></div> 
                <div id="c12-3" class="ref-cell-r-wall"></div> 
                <div id="c11-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="62" class="ref-cell-grid">
                <div id="c12-4" class="ref-cell-square"></div> 
                <div id="c12-5" class="ref-cell-r-wall"></div> 
                <div id="c11-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="63" class="ref-cell-grid">
                <div id="c12-6" class="ref-cell-square"></div> 
                <div id="c12-7" class="ref-cell-r-wall"></div> 
                <div id="c11-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="64" class="ref-cell-grid">
                <div id="c12-8" class="ref-cell-square"></div> 
                <div id="c12-9" class="ref-cell-r-wall"></div> 
                <div id="c11-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="65" class="ref-cell-grid">
                <div id="c12-10" class="ref-cell-square"></div> 
                <div id="c12-11" class="ref-cell-r-wall"></div> 
                <div id="c11-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="66" class="ref-cell-grid">
                <div id="c12-12" class="ref-cell-square"></div> 
                <div id="c12-13" class="ref-cell-r-wall"></div> 
                <div id="c11-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="67" class="ref-cell-grid">
                <div id="c12-14" class="ref-cell-square"></div> 
                <div id="c12-15" class="ref-cell-r-wall"></div> 
                <div id="c11-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="68" class="ref-cell-grid">
                <div id="c12-16" class="ref-cell-square"></div> 
                <div id="c11-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="50" class="ref-cell-grid">
                <div id="c10-0" class="ref-cell-square"></div> 
                <div id="c10-1" class="ref-cell-r-wall"></div> 
                <div id="c9-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="51" class="ref-cell-grid">
                <div id="c10-2" class="ref-cell-square"></div> 
                <div id="c10-3" class="ref-cell-r-wall"></div> 
                <div id="c9-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="52" class="ref-cell-grid">
                <div id="c10-4" class="ref-cell-square"></div> 
                <div id="c10-5" class="ref-cell-r-wall"></div> 
                <div id="c9-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="53" class="ref-cell-grid">
                <div id="c10-6" class="ref-cell-square"></div> 
                <div id="c10-7" class="ref-cell-r-wall"></div> 
                <div id="c9-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="54" class="ref-cell-grid">
                <div id="c10-8" class="ref-cell-square"></div> 
                <div id="c10-9" class="ref-cell-r-wall"></div> 
                <div id="c9-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="55" class="ref-cell-grid">
                <div id="c10-10" class="ref-cell-square"></div> 
                <div id="c10-11" class="ref-cell-r-wall"></div> 
                <div id="c9-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="56" class="ref-cell-grid">
                <div id="c10-12" class="ref-cell-square"></div> 
                <div id="c10-13" class="ref-cell-r-wall"></div> 
                <div id="c9-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="57" class="ref-cell-grid">
                <div id="c10-14" class="ref-cell-square"></div> 
                <div id="c10-15" class="ref-cell-r-wall"></div> 
                <div id="c9-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="58" class="ref-cell-grid">
                <div id="c10-16" class="ref-cell-square"></div> 
                <div id="c9-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="40" class="ref-cell-grid">
                <div id="c8-0" class="ref-cell-square">
                </div> 
                <div id="c8-1" class="ref-cell-r-wall"></div> 
                <div id="c7-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="41" class="ref-cell-grid">
                <div id="c8-2" class="ref-cell-square"></div> 
                <div id="c8-3" class="ref-cell-r-wall"></div> 
                <div id="c7-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="42" class="ref-cell-grid">
                <div id="c8-4" class="ref-cell-square"></div> 
                <div id="c8-5" class="ref-cell-r-wall"></div> 
                <div id="c7-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="43" class="ref-cell-grid">
                <div id="c8-6" class="ref-cell-square"></div> 
                <div id="c8-7" class="ref-cell-r-wall"></div> 
                <div id="c7-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="44" class="ref-cell-grid">
                <div id="c8-8" class="ref-cell-square"></div> 
                <div id="c8-9" class="ref-cell-r-wall"></div> 
                <div id="c7-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="45" class="ref-cell-grid">
                <div id="c8-10" class="ref-cell-square"></div> 
                <div id="c8-11" class="ref-cell-r-wall"></div> 
                <div id="c7-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="46" class="ref-cell-grid">
                <div id="c8-12" class="ref-cell-square"></div> 
                <div id="c8-13" class="ref-cell-r-wall"></div> 
                <div id="c7-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="47" class="ref-cell-grid">
                <div id="c8-14" class="ref-cell-square"></div> 
                <div id="c8-15" class="ref-cell-r-wall"></div> 
                <div id="c7-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="48" class="ref-cell-grid">
                <div id="c8-16" class="ref-cell-square">

                </div> 
                <div id="c7-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="30" class="ref-cell-grid">
                <div id="c6-0" class="ref-cell-square"></div> 
                <div id="c6-1" class="ref-cell-r-wall"></div> 
                <div id="c5-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="31" class="ref-cell-grid">
                <div id="c6-2" class="ref-cell-square"></div> 
                <div id="c6-3" class="ref-cell-r-wall"></div> 
                <div id="c5-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="32" class="ref-cell-grid">
                <div id="c6-4" class="ref-cell-square"></div> 
                <div id="c6-5" class="ref-cell-r-wall"></div> 
                <div id="c5-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="33" class="ref-cell-grid">
                <div id="c6-6" class="ref-cell-square"></div> 
                <div id="c6-7" class="ref-cell-r-wall"></div> 
                <div id="c5-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="34" class="ref-cell-grid">
                <div id="c6-8" class="ref-cell-square"></div> 
                <div id="c6-9" class="ref-cell-r-wall"></div> 
                <div id="c5-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="35" class="ref-cell-grid">
                <div id="c6-10" class="ref-cell-square"></div> 
                <div id="c6-11" class="ref-cell-r-wall"></div> 
                <div id="c5-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="36" class="ref-cell-grid">
                <div id="c6-12" class="ref-cell-square"></div> 
                <div id="c6-13" class="ref-cell-r-wall"></div> 
                <div id="c5-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="37" class="ref-cell-grid">
                <div id="c6-14" class="ref-cell-square"></div> 
                <div id="c6-15" class="ref-cell-r-wall"></div> 
                <div id="c5-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="38" class="ref-cell-grid">
                <div id="c6-16" class="ref-cell-square"></div> 
                <div id="c5-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="20" class="ref-cell-grid">
                <div id="c4-0" class="ref-cell-square"></div> 
                <div id="c4-1" class="ref-cell-r-wall"></div> 
                <div id="c3-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="21" class="ref-cell-grid">
                <div id="c4-2" class="ref-cell-square"></div> 
                <div id="c4-3" class="ref-cell-r-wall"></div> 
                <div id="c3-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="22" class="ref-cell-grid">
                <div id="c4-4" class="ref-cell-square"></div> 
                <div id="c4-5" class="ref-cell-r-wall"></div> 
                <div id="c3-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="23" class="ref-cell-grid">
                <div id="c4-6" class="ref-cell-square"></div> 
                <div id="c4-7" class="ref-cell-r-wall"></div> 
                <div id="c3-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="24" class="ref-cell-grid">
                <div id="c4-8" class="ref-cell-square"></div> 
                <div id="c4-9" class="ref-cell-r-wall"></div> 
                <div id="c3-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="25" class="ref-cell-grid">
                <div id="c4-10" class="ref-cell-square"></div> 
                <div id="c4-11" class="ref-cell-r-wall"></div> 
                <div id="c3-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="26" class="ref-cell-grid">
                <div id="c4-12" class="ref-cell-square"></div> 
                <div id="c4-13" class="ref-cell-r-wall"></div> 
                <div id="c3-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="27" class="ref-cell-grid">
                <div id="c4-14" class="ref-cell-square"></div> 
                <div id="c4-15" class="ref-cell-r-wall"></div> 
                <div id="c3-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="28" class="ref-cell-grid">
                <div id="c4-16" class="ref-cell-square"></div> 
                <div id="c3-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="10" class="ref-cell-grid">
                <div id="c2-0" class="ref-cell-square"></div> 
                <div id="c2-1" class="ref-cell-r-wall"></div> 
                <div id="c1-0" class="ref-cell-b-wall"></div> 
              </div>
              <div id="11" class="ref-cell-grid">
                <div id="c2-2" class="ref-cell-square"></div> 
                <div id="c2-3" class="ref-cell-r-wall"></div> 
                <div id="c1-2" class="ref-cell-b-wall"></div> 
              </div>
              <div id="12" class="ref-cell-grid">
                <div id="c2-4" class="ref-cell-square"></div> 
                <div id="c2-5" class="ref-cell-r-wall"></div> 
                <div id="c1-4" class="ref-cell-b-wall"></div> 
              </div>
              <div id="13" class="ref-cell-grid">
                <div id="c2-6" class="ref-cell-square"></div> 
                <div id="c2-7" class="ref-cell-r-wall"></div> 
                <div id="c1-6" class="ref-cell-b-wall"></div> 
              </div>
              <div id="14" class="ref-cell-grid">
                <div id="c2-8" class="ref-cell-square"></div> 
                <div id="c2-9" class="ref-cell-r-wall"></div> 
                <div id="c1-8" class="ref-cell-b-wall"></div> 
              </div>
              <div id="15" class="ref-cell-grid">
                <div id="c2-10" class="ref-cell-square"></div> 
                <div id="c2-11" class="ref-cell-r-wall"></div> 
                <div id="c1-10" class="ref-cell-b-wall"></div> 
              </div>
              <div id="16" class="ref-cell-grid">
                <div id="c2-12" class="ref-cell-square"></div> 
                <div id="c2-13" class="ref-cell-r-wall"></div> 
                <div id="c1-12" class="ref-cell-b-wall"></div> 
              </div>
              <div id="17" class="ref-cell-grid">
                <div id="c2-14" class="ref-cell-square"></div> 
                <div id="c2-15" class="ref-cell-r-wall"></div> 
                <div id="c1-14" class="ref-cell-b-wall"></div> 
              </div>
              <div id="18" class="ref-cell-grid">
                <div id="c2-16" class="ref-cell-square"></div> 
                <div id="c1-16" class="ref-cell-b-wall"></div> 
              </div>


              <div id="0" class="ref-cell-grid">
                <div id="c0-0" class="ref-cell-square"></div> 
                <div id="c0-1" class="ref-cell-r-wall"></div> 
              </div>
              <div id="1" class="ref-cell-grid">
                <div id="c0-2" class="ref-cell-square"></div> 
                <div id="c0-3" class="ref-cell-r-wall"></div> 
              </div>
              <div id="2" class="ref-cell-grid">
                <div id="c0-4" class="ref-cell-square"></div> 
                <div id="c0-5" class="ref-cell-r-wall"></div> 
              </div>
              <div id="3" class="ref-cell-grid">
                <div id="c0-6" class="ref-cell-square"></div> 
                <div id="c0-7" class="ref-cell-r-wall"></div> 
              </div>
              <div id="4" class="ref-cell-grid">
                <div id="c0-8" class="ref-cell-square">
                  <img src={bluepawn} />
                </div> 
                <div id="c0-9" class="ref-cell-r-wall"></div> 
              </div>
              <div id="5" class="ref-cell-grid">
                <div id="c0-10" class="ref-cell-square"></div> 
                <div id="c0-11" class="ref-cell-r-wall"></div> 
              </div>
              <div id="6" class="ref-cell-grid">
                <div id="c0-12" class="ref-cell-square"></div> 
                <div id="c0-13" class="ref-cell-r-wall"></div> 
              </div>
              <div id="7" class="ref-cell-grid">
                <div id="c0-14" class="ref-cell-square"></div> 
                <div id="c0-15" class="ref-cell-r-wall"></div> 
              </div>
              <div id="8" class="ref-cell-grid">
                <div id="c0-16" class="ref-cell-square"></div> 
              </div>
            </div>
          </div>

          <div class="status-container">
            <div id="connect-container" class="connect-container">
              <div class="player-title-invert">Start Game: Enter @p to begin...</div>
              <br />
              <div class="connect-box">
                <label class="input-label" for="at-p">Username:</label>
                <input class="input-username" type="text"  id="at-p"></input>
                <button id="send-request-button" class="send-request-button"> Send Request &#8599;</button>
              </div>
            </div>

            <div class="player-container">
              <div id="player1" class="player-stats">
                  <div id="player-title1" class="player-title-invert">Player 1: ~nodsup</div>
                  <div class="wall-chart">
                    <div id="p1w1" class="wall"> W1</div>
                    <div id="p1w2" class="wall">W2</div>
                    <div id="p1w3" class="wall">W3</div>
                    <div id="p1w4" class="wall">W4</div>
                    <div id="p1w5" class="wall">W5</div>
                    <div id="p1w6" class="wall">W6</div>
                    <div id="p1w7" class="wall">W7</div>
                    <div id="p1w8" class="wall">W8</div>
                    <div id="p1w9" class="wall">W9</div>
                    <div id="p1w10" class="wall">W10</div>
                </div>
              </div>
              <div id="player2" class="player-stats">
                  <div id="player-title2" class="player-title-invert">Player 2: ~todsup</div>
                  <div class="wall-chart">
                      <div id="p2w1" class="wall"> W1</div>
                      <div id="p2w2" class="wall">W2</div>
                      <div id="p2w3" class="wall">W3</div>
                      <div id="p2w4" class="wall">W4</div>
                      <div id="p2w5" class="wall">W5</div>
                      <div id="p2w6" class="wall">W6</div>
                      <div id="p2w7" class="wall">W7</div>
                      <div id="p2w8" class="wall">W8</div>
                      <div id="p2w9" class="wall">W9</div>
                      <div id="p2w10" class="wall">W10</div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App;