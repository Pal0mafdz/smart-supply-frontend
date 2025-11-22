
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"


type Props = {
    stats: {
      pendientes: number
      enPreparacion: number
      listos: number
    }
  }

const KitchenStats = ({stats}: Props) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>En cola</CardDescription>
          <CardTitle className="text-2xl">{stats.pendientes}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Órdenes recibidas sin iniciar preparación
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>En preparación</CardDescription>
          <CardTitle className="text-2xl">{stats.enPreparacion}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Prioriza las de mayor tiempo de espera
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Listas para servir</CardDescription>
          <CardTitle className="text-2xl">{stats.listos}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Notifica al mesero en cuanto estén listas
        </CardContent>
      </Card>
    </div>
  )
}

export default KitchenStats