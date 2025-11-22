// import { Button } from "@/components/ui/button";
// import { useUpdateDishStatus } from "@/api/MyOrderApi";

// type Props = {
//   order: any; 
// };

// const WaiterCardOrder = ({ order }: Props) => {
//   const { updateDishStatus, isLoading } = useUpdateDishStatus();

//   const handleDelivered = async (dishId: string) => {
//     await updateDishStatus({
//       orderId: order._id,
//       dishId,
//       status: "entregado",
//     });
//   };

//   return (
//     <div className="border rounded-xl p-4 bg-white shadow-sm">
//       <div className="font-semibold mb-2">Orden #{order.number}</div>
//       <div className="font-semibold mb-2">Mesero a cargo {order.user}</div>

//       <div className="space-y-2">
//         {order.dishes.map((dish: any) => (
//           <div
//             key={dish._id}
//             className="flex items-center justify-between text-sm"
//           >
//             <div>
//               <div className="font-medium">
//                 {dish.recipe?.recipename ?? "Platillo"}
//               </div>
//               <div className="text-xs text-gray-500">
//                 {dish.quantity}x · {dish.status}
//               </div>
//             </div>

//             {dish.status === "listo para servir" && (
//               <Button
//                 size="sm"
//                 className="bg-emerald-600 hover:bg-emerald-700 text-white"
//                 disabled={isLoading}
//                 onClick={() => handleDelivered(dish._id)}
//               >
//                 Entregar
//               </Button>
//             )}

//             {dish.status === "entregado" && (
//               <span className="text-xs text-emerald-600 font-semibold">
//                 Entregado
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WaiterCardOrder;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUpdateDishStatus } from "@/api/MyOrderApi";

type Props = {
  order: any;
};

const WaiterCardOrder = ({ order }: Props) => {
  const { updateDishStatus, isLoading } = useUpdateDishStatus();

  const waiterName =
    order.waiter?.name ||
    order.waiter?.email ||
    "Mesero desconocido";

  const waiterAvatar = order.waiter?.avatarUrl;

  const handleDelivered = async (dishId: string) => {
    await updateDishStatus({
      orderId: order._id,
      dishId,
      status: "entregado",
    });
  };

  return (
    <Card className="shadow-sm border border-stone-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Orden #{order.number}
        </CardTitle>

        {/* Mesero */}
        <div className="flex items-center gap-2 mt-1">
          {waiterAvatar ? (
            <img
              src={waiterAvatar}
              className="w-7 h-7 rounded-full object-cover border"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-stone-300 flex items-center justify-center text-[10px] text-white capitalize">
              {waiterName.charAt(0)}
            </div>
          )}

          <span className="text-sm text-stone-600 font-medium">
            {waiterName}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-3">
        {order.dishes.map((dish: any) => (
          <div
            key={dish._id}
            className="flex items-center justify-between bg-stone-50 border rounded-md p-2"
          >
            {/* Nombre del platillo + estado */}
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {dish.recipe?.recipename ?? "Platillo"}
              </span>

              <span className="text-xs text-stone-500">
                {dish.quantity}x · {dish.status}
              </span>
            </div>

            {/* Botón o etiqueta */}
            {dish.status === "listo para servir" ? (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isLoading}
                onClick={() => handleDelivered(dish._id)}
              >
                Entregar
              </Button>
            ) : dish.status === "entregado" ? (
              <span className="text-[11px] font-semibold px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                Entregado
              </span>
            ) : (
              <span className="text-[11px] text-stone-500">En proceso</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WaiterCardOrder;

