/-  *quoridor  :: import quoridor structure (/sur) file.
::Note that on-watch and on-agent use the barket |^ ++local ++remote coding pattern.
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0
  $:  values=(list @)
      pmap=playermap  
      wlist=walllist  
      tcount=@ud
      ourpnum=@ud
  ==
+$  card  card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this     .
    default  ~(. (default-agent this %|) bowl)
++  on-init   on-init:default
++  on-save   !>(state)
++  on-load  
  |=  old=vase
  ^-  (quip card _this)
  `this(state !<(state-0 old))
++  on-poke
   ::mark set by app.jsx in its poke request.
    |=  [=mark =vase] 
    |^  ^-  (quip card _this)

    ?>  ?=(%quoridor-action mark)
    =/  act  !<(action vase)
    ?:  =(our.bowl src.bowl)
      (localpoke act)
      (remotepoke act)

    ++  localpoke
    |=  act=action
      ?-  -.act
        %pawnmove 
          ~&  "%pawnmove:"  ~&  act
          =/  pselect  (~(got by pmap) pnum.act)  ~&  pselect  
          =/  modplayer  ^-  player  [pnum.act name.pselect pos.act wallcount.pselect]
          ~&  our.bowl  ~&  "has recorded a new move from the FE."
          :_  %=  this  pmap  (~(put by pmap) [pnum.act modplayer])  tcount  .+  tcount  ==
          :~  [%give %fact ~[/qsub-frontend] %quoridor-update !>(`update`[%okmove player=name.pselect pos=pos.act tc=(add tcount 1)])]
          :: Reminder:: ~fes (or other player) is subscribed to qsub. 
          [%give %fact ~[/qsub] %quoridor-update !>(`update`[%intmove pnum=pnum.act player=name.pselect pos=pos.act tc=(add tcount 1)])]
          ==
        %wallmove
          ~&  "%wallmove:"  ~&  act
          ::Make a wall, add to wlist
          =/  newwall  ^-  wall  [wp1.act wp2.act] 
          =/  modlist  ^-  walllist  :-  newwall  wlist
          ::Access player, subtract a wall
          =/  prec  (~(got by pmap) pnum.act)
          =/  modplayer  ^-  player  [pnum.act name.prec ppos.prec (dec wallcount.prec)]
          :_  %=  this  wlist  modlist  tcount  .+  tcount  pmap  (~(put by pmap) [pnum.act modplayer])  ==
          :~  [%give %fact ~[/qsub-frontend] %quoridor-update !>(`update`[%okwall player=name.prec w1p1=row.wp1.newwall w1p2=col.wp1.newwall w2p1=row.wp2.newwall w2p2=col.wp2.newwall tc=tcount])]
              [%give %fact ~[/qsub] %quoridor-update !>(`update`[%intwall pnum=pnum.act player=name.prec w1p1=row.wp1.newwall w1p2=col.wp1.newwall w2p1=row.wp2.newwall w2p2=col.wp2.newwall tc=tcount])]      
          ==
        %newgame  
        ~&  "%newgame:"  ~&  act
        ::Called after hellosub handshake.  We set up p1 and p2, and get ready to start game.
        :: Is map empty?
        ?>  =(pmap ~)
            =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 our.bowl playpos1 10]
            =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 p2name.act playpos2 10]
            :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ourpnum  1  ==
            [%give %fact ~[/qsub] %quoridor-update !>(`update`[%passign p1=our.bowl p2=p2name.act])]~
        %hellosub  
        ::Start by setting up subscriptions. %watch on other player to begin.
          ~&  "%hellosub request:"  ~&  act
          :_  this
          [%pass /(scot %p our.bowl)/wire %agent [target.act %quoridor] %watch /qsub]~
        %clearstate
          ~&  'clear state has been requested'
          ?:  =(our.bowl ~zod)  ::send to ~fes
            :_  %=  this  pmap  *playermap  wlist  *walllist  tcount  0  ourpnum  0  ==
            :~  [%pass /(scot %p our.bowl)/wire %agent [~fes %quoridor] %leave ~]  ::Bye fes!
                [%give %kick ~[/qdata] ~]  ::Bye FE!
                [%give %kick ~[/qsub] ~]  ::Bye FE!
                [%give %kick ~[/qsub-frontend] ~]
            ==
            ::else send to ~zod
            :_  %=  this  pmap  *playermap  wlist  *walllist  tcount  0  ourpnum  0  ==
            :~  [%pass /(scot %p our.bowl)/wire %agent [~zod %quoridor] %leave ~]  ::Bye zod!
                [%give %kick ~[/qdata] ~]
                [%give %kick ~[/qsub] ~]  ::Bye FE!
                [%give %kick ~[/qsub-frontend] ~]
            ==
      ==
    ++  remotepoke  
      ::There aren't any remote pokes handled locally, for this app (?)
      |=  act=action
        :_  this  ~
    --  ::this is to terminate our barket (|^)
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:default path)
    [%x %qdata ~]  ``noun+!>(values)
  ==
::For incoming subscriptions.
++  on-watch
    |=  =path  
    ^-  (quip card _this)
    |^  ::...how i learned to stop worrying and love the bar-ket.
      ?~  path  !!  ?:  =(our.bowl src.bowl)  (localarm path)  (remotearm path)
      ++  localarm  ::Front End Subscription
        |=  path=(list @ta)  ~&  "localarm:on-watch FE subscribe... "  ~&  "path is:"  ~&  path
            :_  this  [%give %fact ~[path] %quoridor-update !>(`update`[%init tc=tcount])]~
      ++  remotearm  :: This is our poke->subscribe path. Used by all participants.
        |=  path=(list @ta)  
          ~&  >  src.bowl  ~&   " has requested a sub. Accepting."
          ::System (Gall/Ames) will automatically send an %ack. Here, we check to see if we have a sub.
          ~&  "wex.bowl:"  ~&  wex.bowl
          ?:  =(wex.bowl ~)  ::If we have no subs, initiate one back.

            :_  this  [%pass /pokes %agent [our.bowl %quoridor] %poke %quoridor-action !>(`action`[%hellosub target=src.bowl])]~
            ::Of the two agents, the one that does *not* have an empty wex.bowl must have been the initiator.
            ::And if we get here, its because p2 (~fes) has sent us a %watch card back. So we can now enter the next phase of our
            ::transaction, which is setting up the players. Let's self poke and do this with [%newgame]
            ~&  "Our wex bowl is not ~. Sending self-poke %newgame"
            :_  this  [%pass /pokes %agent [our.bowl %quoridor] %poke %quoridor-action !>(`action`[%newgame p2name=src.bowl])]~
    --
++  on-arvo   on-arvo:default 
++  on-leave  on-leave:default
::for subscription updates, and responses from external agents.
++  on-agent
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
  ::?>  ?=(/(scot %p our.bowl)/wire wire)
  ?+    -.sign  (on-agent:default wire sign)
      %watch-ack
    ?~  p.sign
      ~&  >  'Subscribe to'  ~&  src.bowl  ~&  'has succeeded.'
      [~ this]
      ~&  >>>  'Subscribe to'  ~&  src.bowl  ~&  'has failed (!!).'
    [~ this]
      %poke-ack
      ?~  p.sign
        ~&  >  'Poke ack from'  ~&  src.bowl  ~&  '. Poke has been recieved.'
        [~ this]
        ~&  >>>  'Poke (N)ack from'  ~&  src.bowl  ~&  '. Something went wrong...'
      [~ this]
      %fact
      ~&  'fact recieved:'  ~&  fact+p.cage.sign
      ::  We take our fact, with its data, and define our player 1 and 2
      ?>  ?=(%quoridor-update p.cage.sign)
      ::setup our initial structure.  ::send a response card to the front end.
      =/  decage  !<(update q.cage.sign)  ~&  decage
      ?+  -.decage  `this
        %passign  
        ~&  our.bowl  ~&  "has recieved a %passign fact. Setting up players..."
        =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 p1.decage playpos1 10]
        =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 p2.decage playpos2 10]
        ~&  "Sending an acceptance update to other player, and update to FE"
        :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ourpnum  2  ==
        :~  [%give %fact ~[/qsub] %quoridor-update !>(`update`[%acceptgame ok=1])]
        [%give %fact ~[/qsub-frontend] %quoridor-update !>(`update`[%festart p1=p1.decage p2=p2.decage])]  ==

        %acceptgame
        ~&  our.bowl  ~&  "has recieved an %acceptgame fact. The game can now begin. It's p1's turn!"
        =/  p1select  (~(got by pmap) 1)  =/  p2select  (~(got by pmap) 2)
        :_  this
        [%give %fact ~[/qsub-frontend] %quoridor-update !>(`update`[%festart p1=name.p1select p2=name.p2select])]~
      
        %intmove
        ~&  our.bowl  ~&  "has recieved an %intgame fact. Updating BE state, and sending to"  ~&  our.bowl  ~&  "'s FE."
        =/  pselect  (~(got by pmap) pnum.decage)  ~&  pselect  
        =/  modplayer  ^-  player  [pnum.decage name.pselect pos.decage wallcount.pselect]
        :_  %=  this  pmap  (~(put by pmap) [pnum.decage modplayer])  ==
        [%give %fact ~[/qsub-frontend] %quoridor-update !>(`update`[%intmove pnum=pnum.decage player=name.pselect pos=pos.decage tc=tc.decage])]~    
     
        %intwall
        ~&  our.bowl  ~&  "has recieved an %intwall fact. Updating BE state, and sending to"  ~&  our.bowl  ~&  "'s FE."
        ~&  "decage::"  ~&  decage
        :: Decrease player count
        =/  pselect  (~(got by pmap) pnum.decage)  ~&  pselect  
        =/  modplayer  ^-  player  [pnum.decage name.pselect ppos.pselect (dec wallcount.pselect)]
        :: Alter our wall list!
        ::       [%intwall pnum=@ud player=@p w1p1=@ud w1p2=@ud w2p1=@ud w2p2=@ud tc=@ud]
        =/  newwall  ^-  wall  [[w1p1.decage w1p2.decage] [w2p1.decage w2p2.decage]]  ~&  newwall 
        =/  modlist  ^-  walllist  :-  newwall  wlist
        :_  %=  this  pmap  (~(put by pmap) [pnum.decage modplayer])  ==
        [%give %fact ~[/qsub-frontend] %quoridor-update !>(`update`[%intwall pnum=pnum.decage player=name.pselect w1p1=row.wp1.newwall w1p2=col.wp1.newwall w2p1=row.wp2.newwall w2p2=col.wp2.newwall tc=tcount])]~
    ==
  ==
++  on-fail   on-fail:default
--