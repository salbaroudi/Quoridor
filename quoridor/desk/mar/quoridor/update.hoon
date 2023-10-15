/-  *quoridor
|_  upd=update
++  grow
  |%
  ++  noun  upd
  ++  json
    =,  enjs:format
    ^-  ^json
    ~&  "upd in update.hoon"  ~&  upd  
    ?-    -.upd
      %init  ::zero means we reset our state, and are ready...
           %+  frond  'init'
             %-  pairs
              :~  ['tc' (numb tc.upd)]  ==
      %move  ~&  "our move update"  ~&  upd  
          %+  frond  'move'
             %-  pairs
             :~  ['target' s+(scot %p target.upd)]
                 ['row' (numb row.pos.upd)]
                 ['col' (numb col.pos.upd)]
              ==
      %sendwall  ~&  "our move update"  ~&  upd
          %+  frond  'wall'
            %-  pairs
            :~  ['target' s+(scot %p target.upd)]
                ['p1row' (numb row.pos1.upd)]
                ['p1col' (numb col.pos1.upd)]
                ['p2row' (numb row.pos2.upd)]
                ['p2col' (numb col.pos2.upd)]
            ==
      %start-game-request  ~&  "our startgamerequest"  ~&  upd
          %+  frond  'startinfo'
            %-  pairs
            :~  ['p1name' s+(scot %p p1name.upd)]
                ['p2name' s+(scot %p p2name.upd)]
            ==
    ==
  --
++  grab
  |%
  ++  noun  update
  --
++  grad  %noun
--