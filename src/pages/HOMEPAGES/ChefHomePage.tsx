import React from "react"
import { useGetOrders } from "@/api/MyOrderApi"

import type { Order, Dish } from "@/types"
import KitchenHeader from "@/components/home-components/KitchenHeader"
import KitchenStats from "@/components/home-components/KitchenStats"
import KitchenDishList from "@/components/home-components/KitchenDishList"

export function ChefHomePage() {
  const { orders, isLoading, isError } = useGetOrders()

  // Agrupar todos los dishes por estado
  const groupedDishes = React.useMemo(() => {
    const allDishes: Dish[] = orders?.flatMap((order: Order) => order.dishes) ?? []
    return {
      pendientes: allDishes.filter((d) => d.status === "pendiente"),
      enPreparacion: allDishes.filter((d) => d.status === "en preparacion"),
      listos: allDishes.filter((d) => d.status === "listo para servir"),
    }
  }, [orders])

  const stats = {
    pendientes: groupedDishes.pendientes.length,
    enPreparacion: groupedDishes.enPreparacion.length,
    listos: groupedDishes.listos.length,
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando órdenes...</p>
  if (isError) return <p className="text-sm text-red-500">Error al obtener órdenes.</p>

  return (
    <div className="w-full p-7 space-y-6">
      <KitchenHeader />
      <KitchenStats stats={stats} />

      <div className="grid gap-6 md:grid-cols-3">
        <KitchenDishList
          title="En cola"
          description="Platillos recibidos sin iniciar preparación"
          dishes={groupedDishes.pendientes}
          color="outline"
        />
        <KitchenDishList
          title="En preparación"
          description="Platillos actualmente en cocina"
          dishes={groupedDishes.enPreparacion}
          color="outline"
        />
        <KitchenDishList
          title="Listos para servir"
          description="Platillos terminados, listos para entregar"
          dishes={groupedDishes.listos}
          color="default"
        />
      </div>
    </div>
  )
}

export default ChefHomePage


