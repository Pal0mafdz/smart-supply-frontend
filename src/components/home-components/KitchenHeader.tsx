
import { Badge } from '../ui/badge'

const KitchenHeader = () => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Cocina · Órdenes activas
        </h1>
        <p className="text-muted-foreground text-sm">
          Visualiza las órdenes en cola, en preparación y listas para servir.
        </p>
      </div>
      <Badge variant="outline" className="text-xs">
        Turno actual
      </Badge>
    </div>
  )
}

export default KitchenHeader