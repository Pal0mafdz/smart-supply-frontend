

import type { Sale } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type Props = {
  kpis: { totalRevenue: number; totalOrders: number; avgTicket: number }
  sales?: Sale[]
  isLoadingSales: boolean
}

const DashboardKpis = ({ kpis, sales, isLoadingSales }: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 ">
      <Card className='bg-peach shadow-none'>
        <CardHeader className="pb-2">
          <CardDescription>Ingresos del día seleccionado</CardDescription>
          <CardTitle className="text-2xl">
            ${" "}
            {kpis.totalRevenue.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Basado en las ventas del día seleccionado.
        </CardContent>
      </Card>

      <Card className='bg-pale-green shadow-none'>
        <CardHeader className="pb-2">
          <CardDescription>Órdenes del día seleccionado</CardDescription>
          <CardTitle className="text-2xl">
            {kpis.totalOrders.toLocaleString("es-MX")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          {isLoadingSales ? "Cargando ventas..." : `${sales?.length ?? 0} registros de venta`}
        </CardContent>
      </Card>

      <Card className='bg-pale-pink shadow-none'>
        <CardHeader className="pb-2">
          <CardDescription>Ticket promedio del día</CardDescription>
          <CardTitle className="text-2xl">
            ${kpis.avgTicket.toLocaleString("es-MX")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Ingreso total / número de órdenes del día.
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardKpis
