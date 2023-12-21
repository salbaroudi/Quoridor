/-  *quoridor
|_  act=action
++  grow
  |%
  ++  noun  act
  --
++  grab
  |%
  ++  noun  action
  ++  json
    =,  dejs:format
    |=  jon=json
    ^-  action
    %.  jon
    %-  of
    :~  ::Raw JSON to $JSON conversion.
        [%pawnmove (ot ~[target+(se %p) pos+(ot ~[row+ni col+ni]) pnum+ni])] 
        [%wallmove (ot ~[target+(se %p) pnum+ni wp1+(ot ~[row+ni col+ni]) wp2+(ot ~[row+ni col+ni])])]
        [%newgame (ot ~[p2name+(se %p)])]
        [%hellosub (ot ~[target+(se %p)])]
        [%clearstate (ot ~[p+ni])]
    ==
  --
++  grad  %noun
--