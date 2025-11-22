import type { Dish } from '@/types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

type Props = {
    title: string
    description: string
    dishes: Dish[]
    color?: "default" | "outline"
  }

const KitchenDishList = ({ title, description, dishes, color = "outline" }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {dishes.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay platillos en esta categoría.</p>
        )}

        {dishes.map((dish) => (
          <div
            key={dish._id ?? Math.random()}
            className="flex flex-col justify-between gap-2 rounded-lg border p-3 md:flex-row md:items-center"
          >
            <div>
              <p className="font-semibold">{dish.recipe.recipename}</p>
              {dish.note && (
                <p className="text-xs text-muted-foreground">Nota: {dish.note}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Cantidad: {dish.quantity}
              </p>
            </div>
            <Badge variant={color}>{dish.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default KitchenDishList