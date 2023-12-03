/-  *quoridor  ::import quoridor sur file.
/+  default-agent, dbug
|%
+$  versioned-state  ::when we change our /sur and state, we need to do an update here.
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
++  on-init   on-init:default  ::we will initialize in other arms.
++  on-save   !>(state)
++  on-load  
  |=  old=vase
  ^-  (quip card _this)
  `this(state !<(state-0 old))  ::form a unit. Alter a wing (state), take an old vase and interpret it as a state-0.
++  on-poke
    |=  [=mark =vase]  ::mark set by app.jsx in its poke request.
    |^  ^-  (quip card _this)

    ?>  ?=(%quoridor-action mark)
    =/  act  !<(action vase)  ::action struct comes from sur file.
    ::~&  "mark="  ~&  mark  ~&  "vase="  ~&  vase
    ::~&  "our="  ~&  our.bowl  ~&  "src="  ~&  src.bowl
    ?:  =(our.bowl src.bowl)
      (localpoke act)
      (remotepoke act)
  
    ++  localpoke
    |=  act=action
      ?-  -.act
        %sendmove 
        ::~&  "move action"  ~&  act
          =/  pselect  (~(got by pmap) pnum.act)  ~&  pselect  
          =/  modplayer  ^-  player  [pnum.act name.pselect pos.act wallcount.pselect]
          :_  %=  this  pmap  (~(put by pmap) [pnum.act modplayer])  tcount  .+  tcount  ==
          [%give %fact ~[/qdata] %quoridor-update !>(`update`[%okmove status='valid' tc=tcount])]~
        %sendwall
        ~&  "wall action"  ~&  act  ::?>  =(our.bowl target.act)
          ::Make a wall, add to wlist
          =/  newwall  ^-  wall  [wp1.act wp2.act] 
          =/  modlist  ^-  walllist  :-  newwall  wlist
          ::Access player, subtract a wall
          =/  prec  (~(got by pmap) pnum.act)
          =/  modplayer  ^-  player  [pnum.act name.prec ppos.prec (dec wallcount.prec)]
          ::Update playermap and walllist, send a gift.
          :_  %=  this  wlist  modlist  tcount  .+  tcount  pmap  (~(put by pmap) [pnum.act modplayer])  ==
          [%give %fact ~[/qdata] %quoridor-update !>(`update`[%okwall status='valid' tc=tcount])]~
        %setupplayers
        ~&  "setuplayers"  ~&  act
        ?>  =(pmap ~)  ::is our map empty?
            =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 p1name.act playpos1 10]
            =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 p2name.act playpos2 10]
            :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ==
            [%give %fact ~[/qdata] %quoridor-update !>(`update`[%passign p1=p1name.act p2=p2name.act])]~
        %newgame  ::Called after hellosub handshake.  We set up p1 and p2, and get ready to start game.
        ~&  "newgame  request made"  ~&  act
        ~&  our.bowl  ~&  "sets up players."
        ?>  =(pmap ~)  ::is our map empty? It should be.
            =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 our.bowl playpos1 10]
            =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 p2name.act playpos2 10]
            :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ourpnum  1  ==
            ~&  "sending fact to wire:"  ~&  ~[/(scot %p p2name.act)/wire]
            [%give %fact ~[/qsub] %quoridor-update !>(`update`[%passign p1=our.bowl p2=p2name.act])]~
        %hellosub  ::Lets set up our subscription ring first. Old Game is deleted!
          ~&  "hello sub request:"  ~&  act
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
      |=  act=action
        :_  this  ~
    --  ::this is to terminate our barket (|^), which is really SS for |% with a $.
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:default path)
    [%x %qdata ~]  ``noun+!>(values)
  ==
::For incoming subscriptions.
++  on-watch
    !:
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
            ::transaction, which is setting up the players. Let's self poke and do this with [%passign]
            ~&  "Our wex bowl is not ~. Sending self-poke %newgame"
            :_  this  [%pass /pokes %agent [our.bowl %quoridor] %poke %quoridor-action !>(`action`[%newgame p2name=src.bowl])]~
    --
++  on-arvo   on-arvo:default  ::responses from other vanes.
++  on-leave  on-leave:default
::for subscription updates, and responses from external agents.
++  on-agent
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
  ::?>  ?=(/(scot %p our.bowl)/wire wire)
  ~&  'on-agent called'  ~&  'our wire='  ~&  wire  
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
      ~&  >>  fact+p.cage.sign  ~&  'we have recieved a fact from '  ~&  src.bowl
      ::~&  >  "outgoing subs"  ~&  >  wex.bowl  ~&  >  "incoming subs"  ~&  >  sup.bowl
      ::  We take our fact, with its data, and define our player 1 and 2
      ?>  ?=(%quoridor-update p.cage.sign)
      ::setup our initial structure.  ::send a response card to the front end.
      =/  decage  !<(update q.cage.sign)  ~&  decage
      ?+  -.decage  `this
        %passign  
        ~&  our.bowl  ~&  "has recieved a %passign fact. Setting up players"
        =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 p1.decage playpos1 10]
        =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 p2.decage playpos2 10]
        ~&  "Sending an acceptance update to other player, and update to FE"
        :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ourpnum  2  ==
        :~  [%give %fact ~[/qsub] %quoridor-update !>(`update`[%acceptgame ok=1])]
        [%give %fact ~[/qsub-frontend] %quoridor-update !>(`update`[%festart p1=p1.decage p2=p2.decage])]
        ==
      
        %acceptgame
        ~&  our.bowl  ~&  "has recieved an %acceptgame fact. The game can now begin. It's p1's turn!"
        =/  p1select  (~(got by pmap) 1)  =/  p2select  (~(got by pmap) 2)
        ~&  >  name.p1select  ~&  >  name.p2select
        :_  this
        [%give %fact ~[/qsub-frontend] %quoridor-update !>(`update`[%festart p1=name.p1select p2=name.p2select])]~
      ==
    ==
++  on-fail   on-fail:default
--