|%
+$  row  @ud
+$  col  @ud
+$  position  [row=row col=col]
+$  action  ::these have to match our action structures.
  $%  [%push target=@p value=@] ::[%push target=~zod value=8] looks as it should
      [%pop target=@p]
      [%move target=@p pos=position]
      [%sendwall target=@p pos1=position pos2=position]
      [%sendplayer target=@p pname=@p wcount=@ud]
  ==
+$  update
  $%  [%init val=(list @) tc=@ud]  ::this doesn't appear in action, because this is a subscribe.
      [%sendplayerinfo pnum=@ud pstart=position]
      action
  ==
+$  ppos  position  ::Player position
+$  wallcount  @ud  :: From 10...0
+$  name  @p  
+$  pnum  @ud  ::Player Number
+$  player  [pnum name ppos wallcount]  
+$  playermap  (map pnum player)  ::pnum -> player structure
--

