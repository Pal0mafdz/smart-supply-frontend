// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// type Props = {
//   isLoading: boolean
//   data?: any[]
// }

// const SalesByRecipeTable = ({isLoading, data}: Props) => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Ventas por receta y día</CardTitle>
//         <CardDescription>
         
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="text-xs max-h-[220px] overflow-auto">
//         {isLoading ? (
//           <p className="text-sm text-muted-foreground">Cargando información...</p>
//         ) : !data || data.length === 0 ? (
//           <p className="text-sm text-muted-foreground">
//             No hay datos en el rango seleccionado.
//           </p>
//         ) : (
//           <table className="w-full text-left text-xs">
//             <thead className="border-b">
//               <tr className="text-muted-foreground">
//                 <th className="py-1 pr-2">Fecha</th>
//                 <th className="py-1 pr-2">Receta</th>
//                 <th className="py-1 pr-2 text-right">Ventas</th>
//                 <th className="py-1 pr-2 text-right">Ingresos</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item) => (
//                 <tr key={`${item.date}-${item.recipeId}`} className="border-b last:border-0">
//                   <td className="py-1 pr-2">
//                     {new Date(item.date).toLocaleDateString("es-MX")}
//                   </td>
//                   <td className="py-1 pr-2">{item.recipeName}</td>
//                   <td className="py-1 pr-2 text-right">{item.totalSales}</td>
//                   <td className="py-1 pr-2 text-right">
//                     ${item.totalRevenue.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// export default SalesByRecipeTable

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Props = {
  isLoading: boolean
  data?: any[]
}

const SalesByRecipeTable = ({ isLoading, data }: Props) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Ventas por receta y día</CardTitle>
        <CardDescription>
          Resumen de ventas agrupadas por receta y fecha seleccionada.
        </CardDescription>
      </CardHeader>

      <CardContent className="text-xs max-h-[220px] overflow-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando información...</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay datos en el rango seleccionado.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Receta</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={`${item.date}-${item.recipeId}`}>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString("es-MX")}
                    </TableCell>
                    <TableCell>{item.recipeName}</TableCell>
                    <TableCell className="text-right">{item.totalSales}</TableCell>
                    <TableCell className="text-right">
                      $
                      {item.totalRevenue.toLocaleString("es-MX", {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SalesByRecipeTable
