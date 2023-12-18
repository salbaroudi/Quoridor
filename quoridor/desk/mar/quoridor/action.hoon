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
    :~  
        [%pawnmove (ot ~[target+(se %p) pos+(ot ~[row+ni col+ni]) pnum+ni])] 
        [%wallmove (ot ~[target+(se %p) pnum+ni wp1+(ot ~[row+ni col+ni]) wp2+(ot ~[row+ni col+ni])])]
        ::[%wallmove [%target 'zod'] [%pos1  [row=X col=Y] [%pos2  [row=X col=Y]]
        [%setupplayers (ot ~[target+(se %p) p1name+(se %p) p2name+(se %p)])]
        [%newgame (ot ~[p2name+(se %p)])]
        [%hellosub (ot ~[target+(se %p)])]
        [%clearstate (ot ~[p+ni])]
    ==
  --
++  grad  %noun
--