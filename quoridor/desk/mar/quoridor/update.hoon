/-  *quoridor
|_  upd=update
++  grow
  |%
  ++  noun  upd
  ++  json
    =,  enjs:format
    ^-  ^json
    ?-    -.upd
      %init  ::tc=0 signals to FE that the app has started up.
           %+  frond  'init'
             %-  pairs
              :~  ['tc' (numb tc.upd)]  ==
      %passign  ::~& 
          %+  frond  'passign'
            %-  pairs
            :~  ['p1' s+(scot %p p1.upd)]
                ['p2' s+(scot %p p2.upd)]
            ==
      %okmove  
          %+  frond  'okmove'
            %-  pairs
            :~  ['player' s+(scot %p player.upd)]
              ['posrow' (numb row.pos.upd)]
              ['poscol' (numb col.pos.upd)]
              ['tc' (numb tc.upd)]
            ==
      %intmove 
          %+  frond  'intmove'
            %-  pairs
            :~  ['player' s+(scot %p player.upd)]
              ['pnum' (numb pnum.upd)]
              ['posrow' (numb row.pos.upd)]
              ['poscol' (numb col.pos.upd)]
              ['tc' (numb tc.upd)]
            ==
      %okwall
          %+  frond  'okwall'
            %-  pairs
            :~  ['player' s+(scot %p player.upd)]
              ['tc' (numb tc.upd)]
              ['w1p1' (numb w1p1.upd)]
              ['w1p2' (numb w1p2.upd)]
              ['w2p1' (numb w2p1.upd)]
              ['w2p2' (numb w2p2.upd)]
            ==
      %intwall 
          %+  frond  'intwall'
            %-  pairs
            :~  ['player' s+(scot %p player.upd)]
              ['tc' (numb tc.upd)]
              ['pnum' (numb pnum.upd)]
              ['w1p1' (numb w1p1.upd)]
              ['w1p2' (numb w1p2.upd)]
              ['w2p1' (numb w2p1.upd)]
              ['w2p2' (numb w2p2.upd)]
            ==
      %acceptgame  
          %+  frond  'acceptgame'
            %-  pairs
            :~  ['ok' (numb ok.upd)]
            ==
      %festart  
          %+  frond  'festart'
            %-  pairs
            :~  ['p1' s+(scot %p p1.upd)]
                ['p2' s+(scot %p p2.upd)]
            ==
    ==
  --
++  grab
  |%
  ++  noun  update
  --
++  grad  %noun
--