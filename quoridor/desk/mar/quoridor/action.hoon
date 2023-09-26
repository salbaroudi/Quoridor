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
    :~  [%push (ot ~[target+(se %p) value+ni])]
        [%pop (se %p)]
        [%move (ot ~[target+(se %p) row+ni])]
    ==
  --
++  grad  %noun
--