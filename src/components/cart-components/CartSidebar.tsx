// import { useState, useMemo } from "react";
// import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
// import { Button } from "../ui/button";
// import { CreditCard, Wallet, ChefHat } from "lucide-react";
// import { ScrollArea } from "../ui/scroll-area";
// import CartItem from "./CartItem";
// import { useGetDishes, useSendNewDishes } from "@/api/MyOrderApi";
// import Spinner from "../Spinner";
// import PaymentDialog from "./PaymentDialog";
// import { useRegisterPayment } from "@/api/MySalesApi"; 
// import type { Dish } from "@/types"; 

// type Props = {
//   tableNumber: number;
//   customers: number;
//   orderId: string;
// };

// const CartSidebar = ({ tableNumber, customers, orderId }: Props) => {
//   const { dishes, isLoading } = useGetDishes(orderId);
//   const { sendNewDishes, isLoading: isSending } = useSendNewDishes();
//   const { registerPayment, isLoading: isRegistering } = useRegisterPayment();

//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [paymentMethod, setPaymentMethod] =
//     useState<"tarjeta" | "efectivo">("efectivo"); 

//   const handleSendToKitchen = () => {
//     sendNewDishes(orderId);
//   };

//   // platos pendientes de enviar a cocina
//   const pendingDishes = (dishes ?? []).filter((d) => !d.sent);


//   const cartItems = useMemo(
//     () =>
//       (dishes ?? [])
//         .filter(
//           (dish): dish is Dish & { recipe: Dish["recipe"] & { _id: string } } =>
//             !!dish.recipe && typeof dish.recipe._id === "string"
//         )
//         .map((dish) => ({
//           productId: dish.recipe._id, 
//           quantity: dish.quantity,
//         })),
//     [dishes]
//   );

//   // items que se muestran en el dialog de pago
//   const itemsForDialog = useMemo(
//     () =>
//       (dishes ?? []).map((dish: Dish) => ({
//         name: dish.recipe.recipename,
//         quantity: dish.quantity,
//         price:
//           dish.quantity > 0 ? Number(dish.subtotal) / Number(dish.quantity) : 0,
//       })),
//     [dishes]
//   );

//   // total a pagar (suma de subtotales)
//   const total = useMemo(
//     () => (dishes ?? []).reduce((acc, d) => acc + Number(d.subtotal), 0),
//     [dishes]
//   );

//   const handleConfirmPayment = async (data: {
//     method: "tarjeta" | "efectivo";
//     amount: number;
//     reference?: string;
//   }) => {
//     await registerPayment({
//       cartItems,
//       method: data.method,
//       reference: data.reference,
//     });

//     setPaymentOpen(false);
    
//   };

//   return (
//     <>
//       <Card className="w-80 h-[75vh] flex flex-col border border-stone-200 shadow-sm ">
//         <CardHeader className="text-stone-600 font-medium">
//           <div className="flex justify-between items-center">
//             <p>Mesa #{tableNumber}</p>
//             <span className="text-sm text-stone-400">
//               {customers} clientes
//             </span>
//           </div>
//         </CardHeader>

//         <CardContent className="flex-1 overflow-hidden px-3 pb-3">
//           <ScrollArea className="h-full px-4">
//             {isLoading ? (
//               <Spinner />
//             ) : dishes && dishes.length > 0 ? (
//               dishes.map((dish) => (
//                 <CartItem key={dish._id} dish={dish} orderId={orderId!} />
//               ))
//             ) : (
//               <p className="text-center text-stone-400 mt-10">
//                 Carrito vacio
//               </p>
//             )}
//           </ScrollArea>
//         </CardContent>

//         <CardFooter className="flex flex-col gap-3">
//           {/* Botones de pago */}
//           <div className="flex justify-around w-full">
//             <Button
//               variant="outline"
//               className="flex-1 flex items-center gap-2 justify-center"
//               type="button"
//               onClick={() => {
//                 setPaymentMethod("tarjeta");
//                 setPaymentOpen(true);
//               }}
//               disabled={!dishes || dishes.length === 0}
//             >
//               <CreditCard size={18} />
//               Tarjeta
//             </Button>
//             <Button
//               variant="outline"
//               className="flex-1 flex items-center gap-2 justify-center"
//               type="button"
//               onClick={() => {
//                 setPaymentMethod("efectivo");
//                 setPaymentOpen(true);
//               }}
//               disabled={!dishes || dishes.length === 0}
//             >
//               <Wallet size={18} />
//               Efectivo
//             </Button>
//           </div>

//           <Button
//             onClick={handleSendToKitchen}
//             disabled={isSending || pendingDishes.length === 0}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white flex items-center gap-2 mt-2"
//           >
//             <ChefHat size={18} />
//             {pendingDishes.length === 0 ? "Nada que mandar" : "Mandar a cocina"}
//           </Button>
//         </CardFooter>
//       </Card>

   
//       <PaymentDialog
//         open={paymentOpen}
//         onOpenChange={setPaymentOpen}
//         total={total}
//         items={itemsForDialog}
//         defaultMethod={paymentMethod}
//         isSubmitting={isRegistering}
//         onConfirm={handleConfirmPayment}
//       />
//     </>
//   );
// };

// export default CartSidebar;

// CartSidebar.tsx
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { CreditCard, Wallet, ChefHat } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import CartItem from "./CartItem";
import { useGetDishes, useSendNewDishes } from "@/api/MyOrderApi";
import Spinner from "../Spinner";
import PaymentDialog from "./PaymentDialog";
import { useRegisterPayment } from "@/api/MySalesApi";
import { useState, useMemo } from "react";
import { toast } from "sonner";


type Props = {
  tableNumber: number;
  customers: number;
  orderId: string;
};

const CartSidebar = ({ tableNumber, customers, orderId }: Props) => {
  const { dishes, isLoading } = useGetDishes(orderId);
  const { sendNewDishes, isLoading: isSending } = useSendNewDishes();
  const { registerPayment, isLoading: isRegistering } = useRegisterPayment();
  // const { toast } = useToast();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<"tarjeta" | "efectivo">("efectivo");

  const handleSendToKitchen = () => {
    sendNewDishes(orderId);
  };

  // items para el diálogo de pago
  const itemsForDialog = useMemo(
    () =>
      (dishes ?? []).map((dish: any) => {
        const unitPrice =
          dish.subtotal && dish.quantity
            ? dish.subtotal / dish.quantity
            : 0;

        return {
          name: dish.recipe?.recipename ?? "Platillo",
          quantity: dish.quantity,
          price: unitPrice,
        };
      }),
    [dishes]
  );

  const total = useMemo(
    () =>
      itemsForDialog.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      ),
    [itemsForDialog]
  );

  // cartItems para enviar al backend (por ahora se usan IDs de recipe)
  const cartItems = useMemo(
    () =>
      (dishes ?? []).map((dish: any) => ({
        productId: dish.recipe?._id as string,
        quantity: dish.quantity as number,
      })),
    [dishes]
  );

  // validar que todos los platos estén ENTREGADOS
  const allDelivered =
    (dishes ?? []).length > 0 &&
    (dishes ?? []).every((d: any) => d.status === "entregado");

  const hasDishes = (dishes ?? []).length > 0;

  const handleConfirmPayment = async (data: {
    method: "tarjeta" | "efectivo";
    amount: number;
    reference?: string;
  }) => {
    if (!hasDishes) {
      toast.error("Sin platillos", {
        description: "No puedes registrar un pago sin platillo.",
      });
      // toast({
      //   variant: "destructive",
      //   title: "No hay platillos",
      //   description: "No puedes registrar un pago sin platillos.",
      // });
      return;
    }

    if (!allDelivered) {
      toast.error("No puedes cobrar aun", {
        description: "Hay platillos sin entregar.",
      });
      // toast({
      //   variant: "destructive",
      //   title: "No puedes cobrar aún",
      //   description: "Hay platillos que todavía no están entregados.",
      // });
      return;
    }

    await registerPayment({
      orderId,
      cartItems,
      method: data.method,
      reference: data.reference,
    });

    toast.success("Pago registrado", {
      description: "La mesa se ha cerrado correctamente.",
    });


    setPaymentOpen(false);
  };

  return (
    <>
      <Card className="w-80 h-[75vh] flex flex-col border border-stone-200 shadow-sm ">
        <CardHeader className="text-stone-600 font-medium">
          <div className="flex justify-between items-center">
            <p>Mesa #{tableNumber}</p>
            <span className="text-sm text-stone-400">
              {customers} clientes
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden px-3 pb-3">
          <ScrollArea className="h-full px-4">
            {isLoading ? (
              <Spinner />
            ) : dishes && dishes.length > 0 ? (
              dishes.map((dish) => (
                <CartItem key={dish._id} dish={dish} orderId={orderId!} />
              ))
            ) : (
              <p className="text-center text-stone-400 mt-10">
                Carrito vacío
              </p>
            )}
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {/* Botones de forma de pago */}
          <div className="flex justify-around w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center gap-2 justify-center"
              onClick={() => {
                setPaymentMethod("tarjeta");
                setPaymentOpen(true);
              }}
              disabled={!hasDishes || !allDelivered || isRegistering}
            >
              <CreditCard size={18} />
              Tarjeta
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center gap-2 justify-center"
              onClick={() => {
                setPaymentMethod("efectivo");
                setPaymentOpen(true);
              }}
              disabled={!hasDishes || !allDelivered || isRegistering}
            >
              <Wallet size={18} />
              Efectivo
            </Button>
          </div>

          {/* Botón mandar a cocina (igual que antes) */}
          {(() => {
            const pendingDishes = dishes?.filter((d) => !d.sent) ?? [];

            return (
              <Button
                onClick={handleSendToKitchen}
                disabled={isSending || pendingDishes.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white flex items-center gap-2 mt-2"
              >
                <ChefHat size={18} />
                {pendingDishes.length === 0
                  ? "Nada que mandar"
                  : "Mandar a cocina"}
              </Button>
            );
          })()}

          {!allDelivered && hasDishes && (
            <p className="text-xs text-red-500 text-center">
              Debes entregar todos los platillos para continuar con el pago.
            </p>
          )}
        </CardFooter>
      </Card>

      {/* Dialog de pago */}
      <PaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        total={total}
        items={itemsForDialog}
        defaultMethod={paymentMethod}
        isSubmitting={isRegistering}
        onConfirm={handleConfirmPayment}
      />
    </>
  );
};

export default CartSidebar;
