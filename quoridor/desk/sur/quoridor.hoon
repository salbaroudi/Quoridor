|%
+$  row  @ud
+$  col  @ud
+$  pos  [row=row col=col]
+$  action
  $%  [%push target=@p value=@]
      [%pop target=@p]
      [%move target=@p pos=pos]
      [%wall target=@p pos1=pos pos2=pos]
  ==
+$  update
  $%  [%init values=(list @)]
      action
  ==
--