|%
+|  %basic-structures  
+$  position  
    $~  [r=0 c=0]
    [r=@ud c=@ud]
+$  wallpos 
    $~  [[r=1 c=0] [r=1 c=2]]
    [position position]

+|  %turn-states  ::Communicated by each player from their FE.
+$  turn
    $%  [%movepawn position]  ::P has moved a pawn to a given position.
        [%placewall wallpos]  ::P has placed a wall
        [%win @] ::P's client detected a win
        [%forfeit @] ::P quit.
    ==
+|  %game-state
+$  ppos  position  ::Player position
+$  wallcount  @ud  :: From 10...0
+$  name  @p  
    +$  pnum  @ud  ::Player Number
+$  player  [pnum name ppos wallcount]  
+$  playermap  (map pnum player)  ::pnum -> player structure
--