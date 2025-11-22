import { useGetShrinkages } from '@/api/MyProductApi'
import Spinner from '@/components/Spinner'
import { SupplierTable } from '@/components/tables/SupplierTable'
import type { Product, Shrinkage} from '@/types'
import type { ColumnDef } from '@tanstack/react-table'




const ShrinkagePage = () => {
    const {shrinkages, isLoading} = useGetShrinkages()

    if(isLoading) return <Spinner/>

    const columns: ColumnDef<Shrinkage>[] = [
        {
            header: "Producto",
            accessorFn: (row) => {
                // Si viene populado (objeto)
                const prod = row.product as Product | string | undefined
        
                if (prod && typeof prod === "object") {
                  return prod.name|| "Sin nombre"
                }
        
                // Si es solo un id (string), al menos mostramos el id
                // if (typeof prod === "string") {
                //   return prod
                // }
        
                return "Sin nombre"
              },
            

        
      
        },
        {
            header: "Cantidad descontada",
        accessorFn: (row) => row.decQuantity ?? 0,
        },
        {
            header: "Nota",
            accessorKey: "description",
        },
        {
            header: "Fecha",
            accessorFn: (row) => new Date(row.date).toLocaleDateString("es-MX"),   
      },
               
    ];
    

  return (
    <div className="w-full p-7 space-y-6">
  


    

    <SupplierTable columns={columns} data={shrinkages??[]}/>

   

 

    </div>
  )
}

export default ShrinkagePage

