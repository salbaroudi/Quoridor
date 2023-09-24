/-  *quoridor
/+  default-agent, dbug
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0
  $:  [%0 values=(list @)]  ::added pawn path.
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
  |=  [=mark =vase]  ::get a mark and vase IN
  ^-  (quip card _this) ::return a list of cards to send
  =/  act  !<(action vase)  ::use action struct to interpret vase
  ?:  ?=(%quoridor-action mark) ::+ve Assert: is our mark a %q-a?
    ?-  -.act  ::now we have a [%mark %inputs...] cases below.
          %push  ::if its a push, and we are target, add to stack (values)
        ?:  =(our.bowl target.act)
          :_  this(values [value.act values])  ::put value.act at head of values list
          ::give a fact card, on path /values, pass mark, make vase
          [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
        ?>  =(our.bowl src.bowl)
        :_  this
        [%pass /pokes %agent [target.act %quoridor] %poke mark vase]~
          %pop
        ?:  =(our.bowl target.act)
          :_  this(values ?~(values ~ t.values))
          [%give %fact ~[/values] %quoridor-update !>(`update`act)]~
        ?>  =(our.bowl src.bowl)
        :_  this
        [%pass /pokes %agent [target.act %quoridor] %poke mark vase]~
    ==
    ?>  ?=(%quoridor-position mark)
      ?-  -.act
          %pos
          ~&  'Our vase is:'  act
      ==
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+  path  (on-peek:default path)
    [%x %values ~]  ``noun+!>(values)
  ==
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  ?=([%values ~] path)
  :_  this
  =/  return  !>(`update`[%init values])  ~&  return  
  [%give %fact ~ %quoridor-update return]~
++  on-arvo   on-arvo:default
++  on-leave  on-leave:default
++  on-agent  on-agent:default
++  on-fail   on-fail:default
--