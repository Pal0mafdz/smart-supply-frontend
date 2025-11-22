// import { useGetOrders } from '@/api/MyOrderApi'
// import Spinner from '@/components/Spinner';
// import WaiterCardOrder from '@/components/order-components/WaiterCardOrder';


// const WaiterOrdersPage = () => {
//     const {orders, isLoading} = useGetOrders();
//     if(isLoading){
//         return <Spinner/>
//     }

//     if(!orders || orders.length === 0){
//         return (
//             <div className="text-center text-gray-500 mt-10">
//               No tienes órdenes activas.
//             </div>
//           )
//     }

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Mis órdenes</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {orders.map((order) => (
//           <WaiterCardOrder key={order._id} order={order} />
//         ))}
//       </div>
//     </div>
//   )
// }

// export default WaiterOrdersPage

import { useState } from "react";
import { useGetOrders } from "@/api/MyOrderApi";
import Spinner from "@/components/Spinner";
import WaiterCardOrder from "@/components/order-components/WaiterCardOrder";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 6;

const WaiterOrdersPage = () => {
  const { orders, isLoading } = useGetOrders();
  const [page, setPage] = useState(1);

  if (isLoading) return <Spinner />;

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No tienes órdenes activas.
      </div>
    );
  }

  // 1) Ordenar por fecha (mas recientes primero)
  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt ?? "").getTime() -
      new Date(a.createdAt ?? "").getTime()
  );

  // 2) Paginacion
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const currentPageOrders = sorted.slice(start, start + PAGE_SIZE);

  return (
    <div className="p-6 space-y-4 pb-24">
      <h1 className="text-2xl font-bold">Mis órdenes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPageOrders.map((order) => (
          <WaiterCardOrder key={order._id} order={order} />
        ))}
      </div>


      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </Button>

        <span className="text-sm text-stone-600">
          Página {page} de {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default WaiterOrdersPage;
