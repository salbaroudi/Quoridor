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
    ~&  "mark="  ~&  mark  ~&  "vase="  ~&  vase
    ~&  "our="  ~&  our.bowl  ~&  "src="  ~&  src.bowl
    ?:  =(our.bowl src.bowl)
      (localpoke act)
      (remotepoke act)
  
    ++  localpoke
    |=  act=action
      ?-  -.act
        %sendmove 
        ~&  "move action"  ~&  act
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
        %newgamerequest  ::We reset our state  resubscribe.  it is **assumed** that a browser reset has sent a %leave card (below)
        ~&  "newgamerequest made"  ~&  act
          :_  %=  this  pmap  *playermap  wlist  *walllist  tcount  0  ourpnum  0  ==
          [%pass /qdata-wire %agent [p2name.act %quoridor] %watch /qdata]~
        %clearstate
          ~&  'clear state has been requested'
          ?:  =(our.bowl ~zod)  ::send to ~fes
            :_  %=  this  pmap  *playermap  wlist  *walllist  tcount  0  ourpnum  0  ==
            [%pass /qdata-wire %agent [~fes %quoridor] %leave ~]~
            ::else send to ~zod
            :_  %=  this  pmap  *playermap  wlist  *walllist  tcount  0  ourpnum  0  ==
            [%pass /qdata-wire %agent [~zod %quoridor] %leave ~]~

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
    |=  =path  
    ^-  (quip card _this)
    |^  ::...how i learned to stop worrying and love the bar-ket.
      ?~  path  !!  ?:  =(our.bowl src.bowl)  (localarm path)  (remotearm path)
      ++  localarm  ::Just renew the FE subscriptions, for now.
      ::apparently, we don't need a case for %leave. Arvo/Gall will deal with it (?)
        |=  path=(list @ta)  ~&  "localarm:on-watch FE subscribe... " 
            :_  this  [%give %fact ~[path] %quoridor-update !>(`update`[%init tc=tcount])]~
      ++  remotearm  ::Once we get here, we finalize our game state, and report back to our other app.
        |=  path=(list @ta)  ::the person who made the sub request is P1. We are P2.
        ~&  >  src.bowl  ~&  >  " has requested a game. Accepting and confirming."
          =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 src.bowl playpos1 10]
          =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 our.bowl playpos2 10]
          :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ourpnum  2  ==
          :: We give back an init fact (one with an empty wire) to the subscriber
          :: By default, we now switch into "waiting" for a move/wall poke for p1
          [%give %fact ~ %quoridor-update !>(`update`[%passign p1=src.bowl p2=our.bowl])]~
    --
++  on-arvo   on-arvo:default  ::responses from other vanes.
++  on-leave  on-leave:default
::for subscription updates, and responses from external agents.
++  on-agent
  |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
  ?>  ?=([%qdata-wire ~] wire)
  ?+    -.sign  (on-agent:default wire sign)
      %watch-ack
    ?~  p.sign
      ~&  >  src.bowl  ~&  >  'subscribe succeeded!'
      [~ this]
      ~&  >>>  src.bowl  ~&  >>>  'subscribe failed!'
    [~ this]
  ::
::      %kick
  ::  %-  (slog '%delta-follower: Got kick, resubscribing...' ~)
   :: :-  ^-  (list card)
    ::    :~  [%pass /values-wire %agent [src.bowl %delta] %watch /values]
    ::    ==
  ::  this
    %fact
    ~&  >>  fact+p.cage.sign  ~&  'we have recieved a fact from '  ~&  src.bowl
    ~&  "what a sign looks like:"  ~&  sign
    ::  We take our fact, with its data, and define our player 1 and 2
    ?>  ?=(%quoridor-update p.cage.sign)
    ::our update type union, to cast our q.cage serialized data....
    ~&  >>  !<(update q.cage.sign)
    :: now, lets setup our game for the initiating player.
    [~ this]
  ==
++  on-fail   on-fail:default
--