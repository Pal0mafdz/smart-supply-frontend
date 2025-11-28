import React from "react"
import {
  useGetSales,
  useGetSalesByRecipeAndPeriod,
} from "@/api/MySalesApi"

import DashboardKpis from "@/components/home-components/DashboardKpis"
import Dashboardheader from "@/components/home-components/Dashboardheader"
import SalesByRecipeTable from "@/components/home-components/SalesByRecipeTable"
import SalesChart from "@/components/home-components/SalesChart"
import TopRecipesChart from "@/components/home-components/TopRecipesChart"
import RecipesPieChart from "@/components/home-components/RecipesPieChart"

import type { Sale } from "@/types"

// ⭐ Formato seguro YYYY-MM-DD
const formatDateForApi = (d: Date) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const AdminHomePage = () => {
  // Hoy sin horas
  const today = React.useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [selectedDate, setSelectedDate] = React.useState<Date>(today)

  // Día seleccionado con formato de API (solo hoy)
  const startDate = React.useMemo(
    () => formatDateForApi(selectedDate),
    [selectedDate]
  )
  const endDate = startDate

  // === Datos del día (tabla y KPIs) ===
  const { sales, isLoading: isLoadingSales } = useGetSales(startDate, endDate)

  const { salesByRecipeAndPeriod, isLoading: isLoadingByRecipePeriod } =
    useGetSalesByRecipeAndPeriod("day", startDate, endDate)

  // === KPIs del día ===
  const kpis = React.useMemo(() => {
    if (!sales || sales.length === 0) {
      return { totalRevenue: 0, totalOrders: 0, avgTicket: 0 }
    }

    const totalRevenue = (sales as Sale[]).reduce(
      (acc, curr) => acc + (curr.price ?? 0),
      0
    )

    const totalOrders = sales.length
    const avgTicket =
      totalOrders === 0 ? 0 : Math.round(totalRevenue / totalOrders)

    return { totalRevenue, totalOrders, avgTicket }
  }, [sales])

  // === Gráfico de ventas de HOY usando sólo getSales ===
  const chartData = React.useMemo(() => {
    if (!sales) return []

    // Agrupar por hora "HH:MM"
    const map = new Map<string, { totalRevenue: number; totalSales: number }>()

    ;(sales as Sale[]).forEach((s) => {
      const raw = s.createdAt ?? (s as any).date
      if (!raw) return

      const d = new Date(raw)
      const hh = String(d.getHours()).padStart(2, "0")
      const mm = String(d.getMinutes()).padStart(2, "0")
      const key = `${hh}:${mm}` // ej. "14:30"

      if (!map.has(key)) {
        map.set(key, { totalRevenue: 0, totalSales: 0 })
      }

      const item = map.get(key)!
      item.totalRevenue += s.price ?? 0
      item.totalSales += 1
    })

    return Array.from(map.entries())
      .map(([time, values]) => ({ date: time, ...values }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [sales])

  // === Top recetas de HOY usando sólo getSales ===
  const topRecipesData = React.useMemo(() => {
    if (!sales) return []

    const map = new Map<
      string,
      { name: string; totalRevenue: number; totalSales: number }
    >()

    ;(sales as Sale[]).forEach((s) => {
      const recipeId = s.recipe?._id
      if (!recipeId) return

      const name = s.recipe?.recipename ?? "Sin nombre"

      if (!map.has(recipeId)) {
        map.set(recipeId, { name, totalRevenue: 0, totalSales: 0 })
      }

      const item = map.get(recipeId)!
      item.totalRevenue += s.price ?? 0
      item.totalSales += 1
    })

    return Array.from(map.entries())
      .map(([recipeId, data]) => ({ recipeId, ...data }))
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5)
  }, [sales])

  return (
    <div className="w-full p-7 space-y-6">
      <Dashboardheader
        today={today}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardKpis
            kpis={kpis}
            sales={sales}
            isLoadingSales={isLoadingSales}
          />

          {/* Gráfica de ventas de HOY (por hora) */}
          <SalesChart isLoading={isLoadingSales} data={chartData} />
        </div>

        <div className="space-y-6">
        
          <TopRecipesChart
            isLoading={isLoadingSales}
            data={topRecipesData}
          />

          <RecipesPieChart
            isLoading={isLoadingSales}
            data={topRecipesData}
          />
        </div>
      </div>

      <div className="space-y-6">
        <SalesByRecipeTable
          isLoading={isLoadingByRecipePeriod}
          data={salesByRecipeAndPeriod}
        />
      </div>
    </div>
  )
}

export default AdminHomePage
