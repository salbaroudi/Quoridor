/-  *quoridor  ::import quoridor sur file.
/+  default-agent, dbug
|%
+$  versioned-state  ::when we change our /sur and state, we need to do an update here.
  $%  state-0
  ==
+$  state-0
  $:  values=(list @)
      pmap=playermap
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
++  on-init   on-init:default
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
      %push
    ~&  "our push act"  ~&  act 
    ?:  =(our.bowl target.act)
      :_  this(values [value.act values])
      [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %quoridor] %poke mark vase]~
  ::
      %pop
    ~&  "our pop act"  ~&  act 
    ?:  =(our.bowl target.act)
      :_  this(values ?~(values ~ t.values))
      [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %quoridor] %poke mark vase]~
  ::
    %move
    ~&  "our move act"  ~&  act
    ?>  =(our.bowl target.act)
      :_  this  [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
  ::
    %sendwall
    ~&  "our wall act"  ~&  act
    ?>  =(our.bowl target.act)
      :_  this  [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    %sendplayer
    ~&  "our sendplayer act"  ~&  act
    ?:  =(pmap ~)  ::is our map empty?
        =/  playnum  1  =/  playpos  ^-  position  [0 8]
        =/  pstrut  ^-  player  [playnum pname.act playpos wcount.act]
        :_  %=  this  pmap  (my ~[[playnum pstrut]])  ==
        [%give %fact ~[/values] %quoridor-update !>(`update`[%sendplayerinfo pnum=playnum pstart=playpos])]~
        ::Not case 
        =/  playnum  2  =/  playpos  ^-  position  [16 8]
        =/  pstrut  ^-  player  [playnum pname.act playpos wcount.act]
        :_  %=  this  pmap  (~(put by pmap) [playnum pstrut])  ==
        [%give %fact ~[/values] %quoridor-update !>(`update`[%sendplayerinfo pnum=playnum pstart=playpos])]~
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:default path)
    [%x %values ~]  ``noun+!>(values)
  ==
++  on-watch  ::Our initial subscription goes here...
  |=  =path
  ^-  (quip card _this)
  ?>  ?=([%values ~] path)
  ~&  [%init val=values tc=tcount]  
  :_  this
  ::we need to match our update structure
  [%give %fact ~ %quoridor-update !>(`update`[%init val=values tc=tcount])]~
++  on-arvo   on-arvo:default
++  on-leave  on-leave:default
++  on-agent  on-agent:default
++  on-fail   on-fail:default
--