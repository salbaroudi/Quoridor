|%
+$  row  @ud
+$  col  @ud
+$  position  [row=row col=col]
+$  wall  [wp1=position wp2=position]
+$  ppos  position  ::Player position
+$  wallcount  @ud  :: From 10...0
+$  name  @p  
+$  pnum  @ud  ::Player Number
+$  player  [pnum=pnum name=name ppos=ppos wallcount=wallcount]  
+$  playermap  (map pnum player)  
+$  walllist  (list wall)  
+$  action  ::These are requests made by FE to BE - to setup game or take a turn
  $%  [%pawnmove target=@p pos=position pnum=@ud]
      [%wallmove target=@p pnum=@ud wp1=position wp2=position]
      [%newgame p2name=@p]
      [%hellosub target=@p]
      [%clearstate p=@ud]
  ==
+$  update  ::these are respones sent by BE to FE client, or to the other players BE client.
  $%  [%init tc=@ud]
      [%passign p1=@p p2=@p]
      [%festart p1=@p p2=@p]
      [%acceptgame ok=@ud]
      [%okmove player=@p pos=position tc=@ud]
      [%okwall player=@p w1p1=@ud w1p2=@ud w2p1=@ud w2p2=@ud tc=@ud]
      ::redundant, but to guard against the short-circuit risks.
      ::Specifically: in the %ok case, sending another %ok card and looping infinitely.
      :: RIP zod-02 o7
      [%intmove pnum=@ud player=@p pos=position tc=@ud]  
      [%intwall pnum=@ud player=@p w1p1=@ud w1p2=@ud w2p1=@ud w2p2=@ud tc=@ud]
  ==
--

