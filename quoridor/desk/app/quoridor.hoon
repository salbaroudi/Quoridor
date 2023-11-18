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
        %newgamerequest
        ~&  "newgamerequest made"  ~&  act
        :_  this  [%pass /qdata-wire %agent [p2name.act %quoridor] %watch /qdata]~
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
++  on-watch  ::somehow, the compiler knows that both gated arms return a card:this structure.
  |=  =path  
    ^-  (quip card _this)
    |^  ::...how i learned to stop worrying and love the bar-ket.
      ?~  path  !!  ?:  =(our.bowl src.bowl)  (localarm path)  (remotearm path)
      ++  localarm
        |=  path=(list @ta)
          :_  %=  this  pmap  *playermap  wlist  *walllist  tcount  0  ==
          [%give %fact ~[path] %quoridor-update !>(`update`[%init tc=tcount])]~
      ++  remotearm
        |=  path=(list @ta)
        ~&  "remotearm path arg"  ~&  path  :_  this  ~
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
  ::
    ::%fact
    ::~&  >>  fact+p.cage.sign
    ::?>  ?=(%delta-update p.cage.sign)
    ::~&  >>  !<(update q.cage.sign)
    ::[~ this]
  ==
++  on-fail   on-fail:default
--