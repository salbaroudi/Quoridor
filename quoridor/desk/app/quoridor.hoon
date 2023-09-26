/-  *quoridor  ::import quoridor sur file.
/+  default-agent, dbug
|%
+$  versioned-state  ::when we change our /sur and state, we need to do an update here.
  $%  state-0
  ==
+$  state-0
  $:  [%0 values=(list @)]
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
    ?:  =(our.bowl target.act)
      :_  this(values [value.act values])
      [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %quoridor] %poke mark vase]~
  ::
      %pop
    ?:  =(our.bowl target.act)
      :_  this(values ?~(values ~ t.values))
      [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
    ?>  =(our.bowl src.bowl)
    :_  this
    [%pass /pokes %agent [target.act %quoridor] %poke mark vase]~
  ::
    %move
    ?>  =(our.bowl target.act)
      :_  this  [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
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