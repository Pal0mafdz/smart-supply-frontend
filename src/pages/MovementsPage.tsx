import { getMovements } from "@/api/MyMovementsApi"
import InventoryNav from "@/components/InventoryNav"
import Spinner from "@/components/Spinner"
import { MovementTable } from "@/components/tables/MovementTable"
import type { Movement } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<Movement>[] = [
    {
      header:"Producto",
      accessorFn: (row) => row.product.name,
  
    },
    {
      header:"Tipo de Movimiento",
      accessorFn: (row) => row.type,

    },
    {
        accessorKey:"quantity",
        header: "Cantidad Movida",
    },
    {
        accessorKey:"prevQuantity",
        header: "Cantidad Anterior",
    },
    {
        accessorKey:"newQuantity",
        header: "Cantidad Nueva",
    },
    {
        header: "Usuario",
        accessorFn: (row) => row.user.role ,
      },
      {
        accessorKey:"note",
        header: "Nota",
      },
    
]

const MovementsPage = () => {
    const {movements, isLoading} = getMovements();
    if(isLoading) return <Spinner/>

  return (
    <div className="w-full p-7 space-y-6">
    <InventoryNav/>

    <MovementTable columns={columns} data={movements??[]}/>
    </div>
  )
}

export default MovementsPage