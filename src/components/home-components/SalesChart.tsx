"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import type { ChartConfig } from "@/components/ui/chart"

type Props = {
  isLoading: boolean
  data?: any[]
}

// configuración para las áreas
const config = {
  totalRevenue: {
    label: "Ingresos",
    color: "var(--chart-2)",
  },
  totalSales: {
    label: "Órdenes",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig

// Aquí sólo mostramos la hora tal cual, porque ya viene como "HH:MM"
const formatTick = (value: string) => value

// Tooltip: mostramos "Hora HH:MM"
const formatLabel = (value: string) => `Hora ${value}`

const SalesChart = ({ isLoading, data }: Props) => {
  return (
    <Card className="lg:col-span-2 h-[620px] shadow-none">
      <CardHeader>
        <div>
          <CardTitle>Ventas de hoy</CardTitle>
          <CardDescription>Distribución por hora del día.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando gráfico...</p>
        ) : (
          <ChartContainer
            config={config}
            className="w-full h-[400px] flex items-center justify-center"
          >
            <AreaChart
              accessibilityLayer
              data={data ?? []}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={formatTick}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-[220px]"
                    indicator="line"
                    labelFormatter={formatLabel}
                  />
                }
              />

              <Area
                dataKey="totalRevenue"
                type="natural"
                fill="var(--color-totalRevenue)"
                fillOpacity={0.35}
                stroke="var(--color-totalRevenue)"
                strokeWidth={2}
              />

              <Area
                dataKey="totalSales"
                type="natural"
                fill="var(--color-totalSales)"
                fillOpacity={0.25}
                stroke="var(--color-totalSales)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default SalesChart


