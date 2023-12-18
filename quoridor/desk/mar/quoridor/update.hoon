/-  *quoridor
|_  upd=update
++  grow
  |%
  ++  noun  upd
  ++  json
    =,  enjs:format
    ^-  ^json
    ::~&  "upd in update.hoon"  ~&  upd  
    ?-    -.upd
      %init  ::zero means we reset our state, and are ready...
           %+  frond  'init'
             %-  pairs
              :~  ['tc' (numb tc.upd)]  ==
      %passign  ::~&  "our passign is"  ~&  upd
          %+  frond  'passign'
            %-  pairs
            :~  ['p1' s+(scot %p p1.upd)]
                ['p2' s+(scot %p p2.upd)]
            ==
      %okmove  ::~&  "our okmove is"  ~&  upd
      ::       [%okmove player=@p pos=position tc=@ud]
          %+  frond  'okmove'
            %-  pairs
            :~  ['player' s+(scot %p player.upd)]
              ['posrow' (numb row.pos.upd)]
              ['poscol' (numb col.pos.upd)]
              ['tc' (numb tc.upd)]
            ==
      %intmove  ::~&  "our okmove is"  ~&  upd
      ::       [%okmove player=@p pos=position tc=@ud]
          %+  frond  'intmove'
            %-  pairs
            :~  ['player' s+(scot %p player.upd)]
              ['pnum' (numb pnum.upd)]
              ['posrow' (numb row.pos.upd)]
              ['poscol' (numb col.pos.upd)]
              ['tc' (numb tc.upd)]
            ==
      %okwall  ~&  "our okwall is"  ~&  upd
          %+  frond  'okwall'
            %-  pairs
            :~  ['player' s+(scot %p player.upd)]
              ['tc' (numb tc.upd)]
              ['w1p1' (numb w1p1.upd)]
              ['w1p2' (numb w1p2.upd)]
              ['w2p1' (numb w2p1.upd)]
              ['w2p2' (numb w2p2.upd)]
            ==
      %intwall  ~&  "our okwall is"  ~&  upd
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
      %acceptgame  ::~&  "our acceptgame is"  ~&  upd
          %+  frond  'acceptgame'
            %-  pairs
            :~  ['ok' (numb ok.upd)]
            ==
      %festart  ::~&  "our passign is"  ~&  upd
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