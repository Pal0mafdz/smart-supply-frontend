

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { TopRecipe } from "@/api/MySalesApi" // 👈 usa tu tipo real

const config = {
  totalRevenue: { label: "Ingresos", color: "var(--chart-1)" },
}

type Props = {
  isLoading: boolean
  data?: TopRecipe[]
}

const TopRecipesChart = ({ isLoading, data }: Props) => {
  const chartData = data ?? []

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Recetas más vendidas</CardTitle>
        <CardDescription>Top por ingresos totales.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : (
          <>
            <ChartContainer config={config} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData} layout="vertical">
                <CartesianGrid horizontal={false} />
                {/* Eje X = dinero */}
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    `$${Number(v).toLocaleString("es-MX", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}`
                  }
                />
                {/* Eje Y = nombre de la receta */}
                <YAxis
                  type="category"
                  dataKey="name"          // 👈 aquí ponemos el nombre
                  tickLine={false}
                  axisLine={false}
                  width={140}             // ancho suficiente para ver el texto
                />

                {/* Tooltip al hacer hover: ya toma el label del eje Y (name) */}
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent payload={undefined} />} />

                <Bar
                  dataKey="totalRevenue"
                  fill="var(--color-totalRevenue)"
                  radius={4}
                  name="Ingresos"
                />
              </BarChart>
            </ChartContainer>

            {/* Lista abajo con el nombre correcto */}
            <div className="mt-4 space-y-2 text-xs">
              {chartData.map((r) => (
                <div key={r.recipeId} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{r.name}</span>
                  <span className="font-medium">
                    $
                    {r.totalRevenue.toLocaleString("es-MX", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default TopRecipesChart


