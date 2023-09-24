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
        ::what do these look like when they hit the agent. Like this:
        ::[%push target=~zod value=12]
    :~  [%push (ot ~[target+(se %p) value+ni])]  
        ::[%pop target=~zod]
        [%pop (se %p)]
    ==
  --
++  grad  %noun
--