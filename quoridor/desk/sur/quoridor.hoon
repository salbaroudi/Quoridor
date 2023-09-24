|%
+$  action
  $%  [%push target=@p value=@]
      [%pop target=@p]
  ==
+$  update
  $%  [%init values=(list @)]
      action
  ==
+$  position  
  $%  [%pos r=@ud c=@ud]  ::a position
  ==
::+$  wall  [bp=position ep=position] ::begin point, end point, both positions
::+$  turn
  ::$%  [%movepawn =position]  ::P has moved a pawn to a given position.
::      [%placewall =wall]  ::P has placed a wall
::  ==
--