/-  quor2
|%
++  testposition
    |=  *
        (position:quor2 [1 1])
++  wallposition
    |=  *
        (wallpos:quor2 [[1 0] [1 2]])
++  ppos 
    |=  *
        (ppos:quor2 [2 4])
++  wallcount
    |=  *
        (wallcount:quor2 5)
++  name
    |=  *
        (name:quor2 ~nodsup-halnux)
++  moveturn
    |=  *
        (turn:quor2 [%movepawn [5 6]])
++  wallturn
    |=  *
        (turn:quor2 [%placewall [[1 2] [1 4]]])
++  winturn
    |=  *
        (turn:quor2 [%win 1])
++  forfeitturn
    |=  *
        (turn:quor2 [%forfeit 1])
++  player
    |=  *
      (player:quor2 [1 ~nodsup-todsup [5 5] 6])
++  playermap
    |=  *
      (playermap:quor2 (my ~[[1 [1 ~nodsup-todsup [5 5] 6]] [2 [2 ~todsup-nodsup [3 3] 4]]]))
++  makeplayermap
    |=  *
        =/  p1  ^-  player  [1 ~nodsup-todsup [5 5] 6]  ~&  p1  (playermap:quor2 (my ~[[1 p1]]))
++  insertplayers
    |=  *
    =/  onemap  (makeplayermap 5)
    =/  twoplayer  ^-  player  [2 ~todsup-nodsup [3 3] 8]
    =/  threeplayer  ^-  player  [3 ~millex-binzod [2 3] 3]
    =/  newmap  (~(put by onemap) [2 twoplayer])
    =/  newermap  (~(put by newmap) [3 threeplayer])  newermap
++  deleteplayers
    |=  *
    =/  allplayers  (insertplayers 5)
    (~(del by allplayers) 3)
++  getplayer  ::use get to have output wrapped in a [~ unit]
    |=  index=@ud
    =/  allplayers  (insertplayers 5)
    (~(got by allplayers) index)
++  genemptymap
    |=  index=@ud
    =/  newplayermap  *playermap:quor2 newplayermap
--

