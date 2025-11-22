

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
// import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// const config = {
//   totalRevenue: { label: "Ingresos", color: "var(--chart-1)" },
//   totalSales: { label: "Órdenes", color: "var(--chart-2)" },
// }

// type Props = {
//   isLoading: boolean
//   data?: any[]
// }

// const SalesChart = ({isLoading, data}: Props) => {
//   return (
//     <Card className="lg:col-span-2">
//     <CardHeader>
//       <CardTitle>Ventas por día</CardTitle>
//       <CardDescription>Ingresos y número de órdenes en los últimos 7 días.</CardDescription>
//     </CardHeader>
//     <CardContent className="px-2 sm:p-6">
//       {isLoading ? (
//         <p className="text-sm text-muted-foreground">Cargando gráfico...</p>
//       ) : (
//         <ChartContainer config={config} className="aspect-auto h-[260px] w-full">
//           <LineChart accessibilityLayer data={data ?? []} margin={{ left: 12, right: 12 }}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={24}
//               tickFormatter={(v) =>
//                 new Date(v).toLocaleDateString("es-MX", { weekday: "short" })
//               }
//             />
//             <ChartTooltip
//               content={
//                 <ChartTooltipContent
//                   className="w-[180px]"
//                   labelFormatter={(v) =>
//                     new Date(v).toLocaleDateString("es-MX", {
//                       weekday: "long",
//                       day: "numeric",
//                       month: "short",
//                     })
//                   }
//                 />
//               }
//             />
//             <Line dataKey="totalRevenue" type="monotone" stroke="var(--color-totalRevenue)" strokeWidth={2} dot={false} />
//             <Line dataKey="totalSales" type="monotone" stroke="var(--color-totalSales)" strokeWidth={2} dot={false} />
//           </LineChart>
//         </ChartContainer>
//       )}
//     </CardContent>
//   </Card>
//   )
// }

// export default SalesChart

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const config = {
  totalRevenue: { label: "Ingresos", color: "var(--chart-1)" },
  totalSales: { label: "Órdenes", color: "var(--chart-2)" },
}

type Period = "week" | "month" | "year"

type Props = {
  isLoading: boolean
  data?: any[]
  period: Period
  onPeriodChange: (p: Period) => void
}

const labelMap: Record<Period, string> = {
  week: "Ventas de la semana",
  month: "Ventas del mes",
  year: "Ventas del año",
}

const SalesChart = ({ isLoading, data, period, onPeriodChange }: Props) => {
  return (
    <Card className="lg:col-span-2 h-full shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>Ventas por periodo</CardTitle>
          <CardDescription>{labelMap[period]} seleccionada.</CardDescription>
        </div>
        <div className="inline-flex rounded-md border bg-muted p-1 text-xs">
          {(["week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={
                "px-2 py-1 rounded-md transition " +
                (period === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground")
              }
            >
              { p === "week" ? "Semana" : p === "month" ? "Mes" : "Año"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando gráfico...</p>
        ) : (
          <ChartContainer config={config} className="aspect-auto h-full w-full lg:h-[240px]">
            <LineChart accessibilityLayer data={data ?? []} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("es-MX", { month: "short", day: "numeric" })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[180px]"
                    labelFormatter={(v) =>
                      new Date(v).toLocaleDateString("es-MX", {
                        weekday: "long",
                        day: "numeric",
                        month: "short",
                      })
                    }
                  />
                }
              />
              <Line dataKey="totalRevenue" type="monotone" stroke="var(--color-totalRevenue)" strokeWidth={2} dot={false} />
              <Line dataKey="totalSales" type="monotone" stroke="var(--color-totalSales)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default SalesChart
