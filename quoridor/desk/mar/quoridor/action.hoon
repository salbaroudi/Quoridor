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
    ~&  "in action, our jon:"  ~&  jon
    %.  jon
    %-  of
    :~  [%push (ot ~[target+(se %p) value+ni])]
        [%pop (se %p)]
        :: [%move [%target 'zod'] [%pos  [row=X col=Y]]
        [%move (ot ~[target+(se %p) pos+(ot ~[row+ni col+ni])])] 
        ::[%wall [%target 'zod'] [%pos1  [row=X col=Y] [%pos1  [row=X col=Y]]
        [%wall (ot ~[target+(se %p) pos1+(ot ~[row+ni col+ni]) pos2+(ot ~[row+ni col+ni])])] 
        [%sendplayer (ot ~[target+(se %p) pnum+ni pname+(se %p)])]
    ==
  --
++  grad  %noun
--