import React, { useEffect, useState, useReducer } from 'react'
import Urbit from '@urbit/http-api'
import { AppTile } from './components/AppTile'

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
    async function init() {
      api.subscribe( { app:"quoridor", path: '/values', event: handleUpdate } )
    }
    init()
  }, [] )

  const handleUpdate = ( upd ) => {
    console.log("our update:")
    console.log(upd)
    if ( 'init' in upd ) {
      dispatch({type:'init', init:upd.init})
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

  const scall = () => {
    console.log("We got a respones back!")
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

  const wall = () => {
    api.poke( {
      app: 'quoridor',
      mark: 'quoridor-action',
      json: { wall: { target:`~${window.ship}`, pos1: {row:1, col:0}, pos2:{row:1, col:2}}},
    } )
  }

const sendplayer = (name,num) => {
  api.poke( {
    app: 'quoridor',
    mark: 'quoridor-action',
    json: { sendplayer: { target:`~${window.ship}`, pnum: num, pname: name}}
  } )
}

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <input style={{width:200}} className='border' type='text' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
      <div>
        <button onClick={() => push()} style={{width:100}} className='border p-2 text-black-400'>Push</button>
        <button onClick={() => pop()} style={{width:100}} className='border p-2 text-black-400'>Pop</button>
        <p>Our stack</p>
        {state.map((eachValue, index) => {
          return (<li key={index}>{eachValue}</li>)
        })}
      </div>
      <button onClick={() => move()} style={{width:100}} className='border p-2 text-black-400'>Send Move</button>
      <button onClick={() => wall()} style={{width:100}} className='border p-2 text-black-400'>Send Wall</button>
      <button onClick={() => sendplayer("~nodsup",1)} style={{width:100}} className='border p-2 text-black-400'>Send P1</button>
      <button onClick={() => sendplayer("~todsup",2)} style={{width:100}} className='border p-2 text-black-400'>Send P2</button>
    </main>
  )
}

export default App;