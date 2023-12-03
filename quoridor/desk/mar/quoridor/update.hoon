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
          %+  frond  'okmove'
            %-  pairs
            :~  ['status' s+status.upd]
              ['tc' (numb tc.upd)]
            ==
      %okwall  ::~&  "our okwall is"  ~&  upd
          %+  frond  'okwall'
            %-  pairs
            :~  ['status' s+status.upd]
              ['tc' (numb tc.upd)]
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