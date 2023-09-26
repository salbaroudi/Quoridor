/-  *quoridor
|_  pos=position
++  grow
  |%
  ++  noun  pos
  --
++  grab
  |%
  ++  noun  position  ::how does it know to check our /sur
  ++  json
    =,  dejs:format
    |=  jon=json
    ^-  position
    %.  jon
    %-  of  ::dont touch these yet!
    :~  [%move (ot ~[r+ni c+ni])]
    ==
  --
++  grad  %noun
--