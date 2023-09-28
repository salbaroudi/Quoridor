/-  *quoridor  ::import quoridor sur file.
/+  default-agent, dbug
|%
+$  versioned-state  ::when we change our /sur and state, we need to do an update here.
  $%  state-0
  ==
+$  state-0
  $:  [%0 values=(list @)]
      [%1 pmap=playermap]
      [%2 tcount=@ud]
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
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?>  ?=(%quoridor-action mark)
  =/  act  !<(action vase)
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
    %wall
    ~&  "our wall act"  ~&  act
    ?>  =(our.bowl target.act)
      :_  this  [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    %sendplayer  ::could also use dbug...
    ~&  "our sendplayer act"  ~&  act  
    :::_  this(values [value.act values],pmap (~))
    =/ playernum pnum.act
    
    :: Get player number from request.
    :: is there an entry with player number Y or N?
    :: if yes, update the player
    ::  get the player structure.
    ::  rewrite the cell and insert
    :: if no, insert new player:
    :: build a player structure
    :: inset into the map.
    :: 
    
      [%give %fact ~[/values] %quoridor-update !>(`update`act)]~

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
  :_  this
  [%give %fact ~ %quoridor-update !>(`update`[%init values])]~
++  on-arvo   on-arvo:default
++  on-leave  on-leave:default
++  on-agent  on-agent:default
++  on-fail   on-fail:default
--