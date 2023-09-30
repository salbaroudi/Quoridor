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
      %pop  (frond 'pop' s+(scot %p target.upd)) 
      ::%init  (frond 'init' a+(turn val.upd numb))
      %sendplayer  ::[Q: ]  we don't need this. Why does hoon complain??
           %+  frond  'sendplayer'  ~
      %sendplayerinfo
           %+  frond  'sendplayernum'
             %-  pairs
             :~  ['pnum' (numb pnum.upd)]
                 ['pstartrow' (numb row.pstart.upd)]
                 ['pstartcol' (numb col.pstart.upd)]
              ==
      %init 
           %+  frond  'init'
             %-  pairs
             :~  ['val' a+(turn val.upd numb)]
                 ['tc' (numb tc.upd)]
              ==
      %push  ~&  "our push update"  ~&  upd  ::coming in from q.app, to send back to FE, looks like: [%push target=~zod value=8] 
           %+  frond  'push'
             %-  pairs
             :~  ['target' s+(scot %p target.upd)]
                 ['value' (numb value.upd)]
              ==  
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
    ==
  --
++  grab
  |%
  ++  noun  update
  --
++  grad  %noun
--