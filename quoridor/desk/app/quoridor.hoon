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
    %move
    ~&  "our move act"  ~&  act
    ?>  =(our.bowl target.act)
      :_  this  [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
  ::
    %sendwall
    ~&  "our wall act"  ~&  act
    ?>  =(our.bowl target.act)
      :_  this  [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    %start-game-request
    ~&  "our sendplayer act"  ~&  act
    ?:  =(pmap ~)  ::is our map empty?
        =/  playnum  1  =/  playpos  ^-  position  [0 8]
        =/  pstrut  ^-  player  [playnum p1name.act playpos 10]
        :_  %=  this  pmap  (my ~[[playnum pstrut]])  ==
        [%give %fact ~[/values] %quoridor-update !>(`update`[%start-game-request target=target.act p1name=p1name.act p2name=p1name.act])]~
        ::Not case 
        =/  playnum  2  =/  playpos  ^-  position  [16 8]
        =/  pstrut  ^-  player  [playnum p2name.act playpos 10]
        :_  %=  this  pmap  (~(put by pmap) [playnum pstrut])  ==
        [%give %fact ~[/values] %quoridor-update !>(`update`[%start-game-request target=target.act p1name=p1name.act p2name=p1name.act])]~
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:default path)
    [%x %values ~]  ``noun+!>(values)
  ==
++  on-watch  ::Our initial subscription goes here...The state is also reset.
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