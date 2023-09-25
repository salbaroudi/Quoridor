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
      (player:quor2  [1 ~nodsup-todsup [5 5] 6])
++  playermap
    |=  *
      (playermap:quor2  (my ~[[1 [1 ~nodsup-todsup [5 5] 6]] [2 [2 ~todsup-nodsup [3 3] 4]]]))
--
