|%
+$  action
  $%  [%push target=@p value=@]
      [%pop target=@p]
      [%move target=@p row=@]
  ==
+$  update
  $%  [%init values=(list @)]
      action
  ==
--