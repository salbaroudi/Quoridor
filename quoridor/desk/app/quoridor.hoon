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
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  ?=(%quoridor-action mark)
  =/  act  !<(action vase)
  ~&  "mark="  ~&  mark  ~&  "vase="  ~&  vase
  ?-    -.act
    %sendmove 
    ~&  "our move act"  ~&  act
      =/  pselect  (~(got by pmap) pnum.act)  ~&  pselect  
      =/  modplayer  ^-  player  [pnum.act name.pselect pos.act wallcount.pselect]
       :_  %=  this  pmap  (~(put by pmap) [pnum.act modplayer])  tcount  .+  tcount  ==
      [%give %fact ~[/values] %quoridor-update !>(`update`[%okmove status='valid' tc=tcount])]~

    %sendwall
    ~&  "our wall act"  ~&  act  ::?>  =(our.bowl target.act)
      ::Make a wall, add to wlist
      =/  newwall  ^-  wall  [wp1.act wp2.act] 
      =/  modlist  ^-  walllist  :-  newwall  wlist
      ::Access player, subtract a wall
      =/  prec  (~(got by pmap) pnum.act)
      =/  modplayer  ^-  player  [pnum.act name.prec ppos.prec (dec wallcount.prec)]
      ::Update playermap and walllist, send a gift.
      :_  %=  this  wlist  modlist  tcount  .+  tcount  pmap  (~(put by pmap) [pnum.act modplayer])  ==
      [%give %fact ~[/values] %quoridor-update !>(`update`[%okwall status='valid' tc=tcount])]~

    %setupplayers
    ~&  "our setup-players act"  ~&  act
    ?>  =(pmap ~)  ::is our map empty?
        =/  playnum1  1  =/  playpos1  ^-  position  [0 8]  =/  pstrut1  ^-  player  [playnum1 p1name.act playpos1 10]
        =/  playnum2  2  =/  playpos2  ^-  position  [16 8]  =/  pstrut2  ^-  player  [playnum2 p2name.act playpos2 10]
        :_  %=  this  pmap  (my ~[[playnum1 pstrut1] [playnum2 pstrut2]])  tcount  .+  tcount  ==
        [%give %fact ~[/values] %quoridor-update !>(`update`[%passign p1=p1name.act p2=p2name.act])]~
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:default path)
    [%x %values ~]  ``noun+!>(values)
  ==
++  on-watch  ::Our initial subscription goes here...The state is also reset. This occurs when we refresh page, and init() is called.
  |=  =path
  ^-  (quip card _this)
  ?>  ?=([%values ~] path)
  :_  %=  this  pmap  *playermap  wlist  *walllist  tcount  0  ==
  [%give %fact ~ %quoridor-update !>(`update`[%init tc=tcount])]~
++  on-arvo   on-arvo:default
++  on-leave  on-leave:default
++  on-agent  on-agent:default
++  on-fail   on-fail:default
--