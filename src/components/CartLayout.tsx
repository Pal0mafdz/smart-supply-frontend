import { Input } from "@/components/ui/input";
import CartSidebar from "./cart-components/CartSidebar";


type Props = {
  children: React.ReactNode;
  tableNumber?: number;
  customers?: number;
  orderId: string
};

const CartLayout = ({ children, tableNumber, customers , orderId}: Props) => {


  return (
    <div className="flex flex-1 flex-col">

        <header className="flex items-center gap-10 px-6 py-4  ">
          <h1 className="text-xl font-semibold tracking-tight">Menú</h1>

          <Input
            placeholder="Buscar platillo..."
            className="w-130 bg-white border-stone-300 text-stone-100 placeholder:text-stone-400" />

        </header>


        <main className="flex flex-1 overflow-hidden ">
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
          
            <CartSidebar tableNumber={tableNumber!} customers={customers!} orderId={orderId} />

        
          
        </main>
      </div>

  );
};

export default CartLayout;
