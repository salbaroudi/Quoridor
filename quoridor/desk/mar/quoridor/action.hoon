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
    ::~&  "in action, our jon:"  ~&  jon
    %.  jon
    %-  of
    :~  :: [%semdmove target=~zod pos=[row=X col=Y] pnum=1]
        [%sendmove (ot ~[target+(se %p) pos+(ot ~[row+ni col+ni]) pnum+ni])] 
        ::[%wall [%target 'zod'] [%pos1  [row=X col=Y] [%pos1  [row=X col=Y]]
        [%sendwall (ot ~[target+(se %p) pnum+ni wp1+(ot ~[row+ni col+ni]) wp2+(ot ~[row+ni col+ni])])] 
        [%setupplayers (ot ~[target+(se %p) p1name+(se %p) p2name+(se %p)])]
        [%newgame (ot ~[p2name+(se %p)])]
        [%hellosub (ot ~[target+(se %p)])]
        [%clearstate (ot ~[p+ni])]
    ==
  --
++  grad  %noun
--