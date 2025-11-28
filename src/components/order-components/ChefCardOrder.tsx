import type { Order } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useUpdateDishStatus } from "@/api/MyOrderApi";
import { cn } from "@/lib/utils";

type Props = {
  order: Order;
};

const ChefCardOrder = ({ order }: Props) => {
  const { updateDishStatus, isLoading } = useUpdateDishStatus();

  const handleStatusChange = (dishId: string, status: string) => {
    updateDishStatus({
      orderId: order._id!,
      dishId,
      status:
        status as
          | "pendiente"
          | "en preparacion"
          | "listo para servir"
          | "entregado",
    });
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  const statusColor = (status: string) => {
    switch (status) {
      case "listo para servir":
        return "border-l-4 border-emerald-500 bg-emerald-50";
      case "en preparacion":
        return "border-l-4 border-amber-400 bg-amber-50";
      case "pendiente":
        return "border-l-4 border-stone-300 bg-stone-50";
      default:
        return "border-l-4 border-stone-200 bg-white";
    }
  };

  return (
    <Card >
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg">
          Orden #{order.number}
        </CardTitle>
        {formattedDate && (
          <p className="text-xs text-stone-500 mt-1">{formattedDate}</p>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-52 pr-1 ">
          {order.dishes.map((dish, i) => (
            <div key={dish._id ?? i}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-md p-2 min-w-0",
                  statusColor(dish.status)
                )}
              >
                {/* Imagen de la receta */}
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-stone-200">
                  {dish.recipe?.imageUrl ? (
                    <img
                      src={dish.recipe.imageUrl}
                      alt={dish.recipe.recipename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-stone-500">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Nombre + descripción */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {dish.recipe?.recipename ?? "Platillo"}
                  </p>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {dish.recipe?.description ?? "Sin descripción"}
                  </p>
                </div>

                {/* Select de estatus */}
                <div className="flex-shrink-0">
  {dish.status === "entregado" ? (
    <span className="text-[10px] font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">
      Entregado
    </span>
  ) : (
    <Select
      onValueChange={(value) => handleStatusChange(dish._id!, value)}
      defaultValue={dish.status}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[140px] h-8 text-xs">
        <SelectValue placeholder="Estatus" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pendiente">Pendiente</SelectItem>
        <SelectItem value="en preparacion">En preparación</SelectItem>
        <SelectItem value="listo para servir">Listo</SelectItem>
      </SelectContent>
    </Select>
  )}
</div>
              </div>

              
              {i < order.dishes.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChefCardOrder;
