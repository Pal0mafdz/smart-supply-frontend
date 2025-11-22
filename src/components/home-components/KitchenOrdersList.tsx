import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

type Props = {
    orders: any[]
    isLoading: boolean
    isError: boolean
  }

const KitchenOrdersList = ({orders, isLoading, isError}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets de cocina</CardTitle>
        <CardDescription>
 
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Cargando órdenes...</p>}
        {isError && <p className="text-sm text-red-500">Error al obtener órdenes de cocina.</p>}
        {!isLoading && !isError && (!orders || orders.length === 0) && (
          <p className="text-sm text-muted-foreground">No hay órdenes activas.</p>
        )}

        {orders?.map((order) => {
          const id = order._id ?? order.id ?? "—"
          const mesa =
            order.tableName ??
            order.table?.name ??
            (order.tableNumber ? `Mesa ${order.tableNumber}` : "Sin mesa")
          const status = order.status ?? "desconocido"
          const createdAt = order.createdAt
            ? new Date(order.createdAt).toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"
          const total = order.total ?? order.totalAmount ?? 0

          return (
            <div
              key={id}
              className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">#{id}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {mesa}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total: ${" "}
                  {Number(total).toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="text-right text-xs">
                  <p className="text-muted-foreground">Hora</p>
                  <p className="font-medium">{createdAt}</p>
                </div>
                <Badge variant={status === "listo para servir" ? "default" : "outline"}>
                  {status}
                </Badge>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default KitchenOrdersList