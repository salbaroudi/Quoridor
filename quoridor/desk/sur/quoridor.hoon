|%
+$  row  @ud
+$  col  @ud
+$  position  [row=row col=col]
+$  action
  $%  [%push target=@p value=@] ::[%push target=~zod value=8] looks as it should
      [%pop target=@p]
      [%move target=@p pos=position]
      [%wall target=@p pos1=position pos2=position]
  ==
+$  update
  $%  [%init values=(list @)]
      action
  ==
--