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
    :~  [%pos (ot ~[r+ni c+ni])]
    ==
  --
++  grad  %noun
--