|%
+$  row  @ud
+$  col  @ud
+$  position  [row=row col=col]
+$  wall  [wp1=position wp2=position]
+$  action  ::these have to match our action structures.
  $%  [%pawnmove target=@p pos=position pnum=@ud]
      [%wallmove target=@p pnum=@ud wp1=position wp2=position]
      [%newgame p2name=@p]
      [%hellosub target=@p]
      [%setupplayers target=@p p1name=@p p2name=@p]
      [%clearstate p=@ud]
  ==
+$  update
  $%  [%init tc=@ud]  ::this doesn't appear in action, because this is a subscribe action.
      [%passign p1=@p p2=@p]
      ::redundant, however recycling a %passign fact in the %passign case
      :: lead to an infinte death loop for ~zod-02 (mixed up paths/wires). RIP zod o7.
      [%festart p1=@p p2=@p]  
      [%acceptgame ok=@ud]
      [%okmove player=@p pos=position tc=@ud]
      [%intmove pnum=@ud player=@p pos=position tc=@ud]  ::redundant, but to guard against the short-circuit risks.
      [%okwall player=@p w1p1=@ud w1p2=@ud w2p1=@ud w2p2=@ud tc=@ud]
      [%intwall pnum=@ud player=@p w1p1=@ud w1p2=@ud w2p1=@ud w2p2=@ud tc=@ud]
  ==
+$  ppos  position  ::Player position
+$  wallcount  @ud  :: From 10...0
+$  name  @p  
+$  pnum  @ud  ::Player Number
+$  player  [pnum=pnum name=name ppos=ppos wallcount=wallcount]  
+$  playermap  (map pnum player)  ::pnum -> player structure
+$  walllist  (list wall)  
--

