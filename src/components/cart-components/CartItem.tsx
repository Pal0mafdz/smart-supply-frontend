import type { Dish } from "@/types";
import { Button } from "../ui/button";
import { Minus, Plus, Trash } from "lucide-react";

import { useRemoveDish, useUpdateDish } from "@/api/MyOrderApi";


type Props = {
  dish: Dish;
  orderId: string;

    
}

const CartItem = ({dish, orderId}: Props) => {
  const {updateDish} = useUpdateDish()
  const {removeDish} = useRemoveDish(orderId);
  return (
    
    <div className="flex items-center justify-between p-2 border-b border-stone-200">
    <div className="text-left">
      <p className="font-medium text-stone-700">{dish.name}</p>
      <p className="text-sm text-stone-500">x{dish.quantity}</p>
    </div>
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => updateDish({ orderId, dishId: dish._id!, quantity: dish.quantity - 1 })}><Minus size={13}/></Button>
      <Button size="sm" onClick={() => updateDish({ orderId, dishId: dish._id!, quantity: dish.quantity + 1 })}><Plus size={13}/></Button>
      <Button size="sm" onClick={()=> removeDish()}><Trash/></Button>
      
    </div>
  </div>
  )
}

export default CartItem