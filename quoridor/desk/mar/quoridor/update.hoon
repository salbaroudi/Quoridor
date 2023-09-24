/-  *quoridor
|_  upd=update
++  grow
  |%
  ++  noun  upd
  ++  json
    =,  enjs:format
    ^-  ^json
    ?-    -.upd
      %pop   (frond 'pop' s+(scot %p target.upd))
      ::Example (from subscribe): ...q=[init 12 5 3 2 1 0]
      %init  (frond 'init' a+(turn values.upd numb))  ::numb parses decimals.
      %push  %+  frond  'push'
             %-  pairs
             :~  ['target' s+(scot %p target.upd)]
                 ['value' (numb value.upd)]
    ==       ==
  --
++  grab
  |%
  ++  noun  update
  --
++  grad  %noun
--