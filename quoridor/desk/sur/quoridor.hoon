|%
+$  row  @ud
+$  col  @ud
+$  position  [row=row col=col]
+$  wall  [wall1=position wall2=position]
+$  action  ::these have to match our action structures.
  $%  [%move target=@p pos=position]
      [%sendwall target=@p pos1=position pos2=position]
      [%start-game-request target=@p p1name=@p p2name=@p]
  ==
+$  update
  $%  [%init tc=@ud]  ::this doesn't appear in action, because this is a subscribe.
      action
  ==
+$  ppos  position  ::Player position
+$  wallcount  @ud  :: From 10...0
+$  name  @p  
+$  pnum  @ud  ::Player Number
+$  player  [pnum name ppos wallcount]  
+$  playermap  (map pnum player)  ::pnum -> player structure
+$  walllist  (list wall)  
--

