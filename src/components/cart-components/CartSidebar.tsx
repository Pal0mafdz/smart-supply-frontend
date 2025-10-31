import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { CreditCard, Wallet, ChefHat } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import CartItem from "./CartItem";
import { useGetDishes } from "@/api/MyOrderApi";
import Spinner from "../Spinner";

type Props = {
  tableNumber: number;
  customers: number;
  orderId: string;
};

const CartSidebar = ({ tableNumber, customers, orderId }: Props) => {
  const {dishes, isLoading} = useGetDishes(orderId);
  return (
    <Card className="w-80 flex flex-col justify-between border border-stone-200 shadow-sm h-[75vh]">
      
      <CardHeader className="text-stone-600 font-medium">
        <div className="flex justify-between items-center">
          <p>Mesa #{tableNumber}</p>
          <span className="text-sm text-stone-400">{customers} clientes</span>
        </div>
      </CardHeader>


      <CardContent className="flex-1 text-center text-stone-400 py-4">
        <ScrollArea>
          {isLoading ? (
            <Spinner/>
          ): dishes && dishes.length > 0 ? (
            dishes.map((dish)=> (
              <CartItem key={dish._id} dish={dish} orderId={orderId!}/>
            ))
          ) : (
            <p className="text-center text-stone-400 mt-10">Carrito vacio</p>
          
          )}

          
  
        </ScrollArea>
        
      </CardContent>

      <CardFooter className="flex flex-col gap-3">

        <div className="flex justify-around w-full">
          <Button
            variant="outline"
            className="flex-1 flex items-center gap-2 justify-center"
          >
            <CreditCard size={18} />
            Tarjeta
          </Button>
          <Button
            variant="outline"
            className="flex-1 flex items-center gap-2 justify-center"
          >
            <Wallet size={18} />
            Efectivo
          </Button>
        </div>

        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 mt-2">
          <ChefHat size={18} />
          Mandar a cocina
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSidebar;

