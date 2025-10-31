import type { Recipe } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Separator } from './ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

import { useState } from 'react'
import { Button } from './ui/button'
import DialogRecipe from './DialogRecipe'
import AlertDeleteRecipe from './AlertDeleteRecipe'

type Props = {
  recipe: Recipe
}

const RecipeCard = ({ recipe }: Props) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);



  
  return (
    <Card className="w-80 h-[555px] flex flex-col justify-between rounded-3xl hover:shadow-lg transition-shadow">
  <div>
    <CardHeader className="flex justify-center p-3">
     
      <div className="rounded-2xl overflow-hidden w-full h-44 relative">
  <img
    src={recipe.imageUrl}
    alt={recipe.recipename}
    className="w-full h-full object-cover transition-opacity duration-500"
    loading="lazy"
    onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
  />
</div>
    </CardHeader>

    <Separator />

    <CardContent className="p-3 space-y-3 flex-1 overflow-hidden">
      <div className='h-18'>
        <h2 className="text-base font-bold truncate">{recipe.recipename}</h2>
        <p className="text-xs text-gray-600 line-clamp-2">{recipe.description}</p>
      </div>

      <Separator />

      <div className="flex flex-col justify-between h-40">
        <h3 className="font-semibold mb-1 text-gray-800 text-sm">Ingredientes</h3>

        <div className="max-h-28 overflow-y-auto rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-100 text-xs">
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Unidad</TableHead>
                <TableHead className="text-center">Cant.</TableHead>
                <TableHead className="text-right">Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.products.map((p, index) => (
                <TableRow key={index} className="text-xs">
                  <TableCell>{p.product.name}</TableCell>
                  <TableCell className="text-center">{p.product.unit}</TableCell>
                  <TableCell className="text-center">{p.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${(p.product.unitprice * p.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator className="my-2" />

        <div className="flex justify-between font-semibold text-gray-900 text-sm">
          <span>Total</span>
          <span>${recipe.totalCost.toFixed(2)}</span>
        </div>
      </div>
    </CardContent>

    <CardFooter className="flex justify-end gap-2">

      <Button onClick={()=> setOpenDialog(true)}>Editar</Button>
      <Button onClick={()=> setOpenDelete(true)}>Eliminar</Button>

      {openDialog && (
      <DialogRecipe
        recipe={recipe}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    )}

    {openDelete && (
      <AlertDeleteRecipe
        recipe={recipe}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      />
    )}


    </CardFooter>
  </div>

 
</Card>

  )
}

export default RecipeCard

