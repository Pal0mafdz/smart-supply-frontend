
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
// import type { TopRecipe } from "@/api/MySalesApi"

import type { TopRecipe } from "@/api/MySalesApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"
import { Pie, PieChart, Cell } from "recharts"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

type Props = {
  isLoading: boolean
  data?: TopRecipe[]
}

const chartConfig = {
    totalRevenue: {
      label: "Ingresos",
    },
  } satisfies ChartConfig
  

// const RecipesPieChart = ({ isLoading, data }: Props) => {
//   const chartData = data ?? []

//   return (
//     <Card className="bg-black">
//       <CardHeader>
//         <CardTitle className="text-stone-300">Distribución de ingresos</CardTitle>
//         <CardDescription className="text-stone-400">Por receta, según el periodo seleccionado.</CardDescription>
//       </CardHeader>
//       <CardContent className="p-0">
//         {isLoading ? (
//           <p className="text-sm text-muted-foreground">Cargando gráfico...</p>
//         ) : chartData.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No hay datos para el periodo seleccionado.
//           </p>
//         ) : (
//           <div className="min-h-[220px] w-full">
//             <ResponsiveContainer width="100%" height={220}>
//               <RePieChart>
//                 <Pie
//                   data={chartData}
//                   dataKey="totalRevenue"
//                   nameKey="name"
//                   innerRadius={50}
//                   outerRadius={80}
//                   paddingAngle={3}
//                 >
//                   {chartData.map((entry, index) => (
//                     <Cell
//                       key={entry.recipeId}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>

//                 {/* Tooltip de Recharts con formateadores válidos */}
//                 <Tooltip
//                   formatter={(value: number, name: string, entry: any) => [
//                     `$${Number(value).toLocaleString("es-MX", {
//                       maximumFractionDigits: 0,
//                     })}`,
//                     entry?.payload?.name ?? name,
//                   ]}
//                   labelFormatter={() => ""}
//                 />
//               </RePieChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// export default RecipesPieChart




const RecipesPieChart = ({isLoading, data}: Props) => {
    const chartData = data ?? []
    
  return (
    <Card className="flex flex-col bg-black shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-stone-300">Distribución de ingresos</CardTitle>
        <CardDescription className="text-stone-400">Por receta, según el periodo seleccionado.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
      {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando gráfico...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay datos para el periodo seleccionado.
          </p>
        ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="totalRevenue"
              nameKey="name"
              stroke="0"
            >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.recipeId}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
            </Pie>
          </PieChart>
          
        </ChartContainer>
        )}
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month 
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}

export default RecipesPieChart
