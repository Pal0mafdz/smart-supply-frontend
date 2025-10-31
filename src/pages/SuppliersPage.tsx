import { useGetSuppliers } from '@/api/MySupplierApi'
import SheetSupplier from '@/components/Dialog-Supplier/SheetSupplier'
import InventoryNav from '@/components/InventoryNav'
import Spinner from '@/components/Spinner'
import { SupplierTable } from '@/components/tables/SupplierTable'
import { Button } from '@/components/ui/button'
import type { Supplier} from '@/types'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'



const SuppliersPage = () => {
    const {suppliers, isLoading} = useGetSuppliers();
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [open, setOpen] = useState(false);

    if(isLoading) return <Spinner/>

    const handleCloseDialog = () => {
        setOpen(false)
        setSelectedSupplier(null)
      }
    
    const handleAddSupplier = () => {

        setSelectedSupplier({ supplierName: '', email: '' } as Supplier)
        setOpen(true)
      }

    const handleUpdate = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setOpen(true);
    }

    const columns: ColumnDef<Supplier>[] = [
        {
          header:"Nombre",
          accessorFn: (row) => row.supplierName,
      
        },
        {
            accessorKey:"email",
            header: "Correo",
        },
        {
          accessorKey:"phone",
          header: "Numero. tel",
        },
        {
          accessorKey:"website",
          header: "Pagina Web",
      },
      {
        accessorKey:"leadTimeDays",
        header: "Tiempo de Entrega",
    },
    {
      accessorKey:"minOrderValue",
      header: "Cantidad minima",
  },
    
        {
            id: "actions",
            header: "",
            cell: ({row})=> {
              
                const supplier = row.original
      
              return(
                <div className="flex items-center">
      
                  <Button variant="ghost" size="icon" onClick={() => handleUpdate(supplier)} title="Editar">
                    <Pencil className="h-4 w-4 text-red-400"/>
      
                  </Button>
                </div>
              )
            }
      
      
          },
          
        
        
    ]
    

  return (
    <div className="w-full p-7 space-y-6">
    <InventoryNav/>

    <Button className='bg-black text-white' onClick={handleAddSupplier}>Agrega un Proveedor</Button>
    

    <SupplierTable columns={columns} data={suppliers??[]}/>

    <SheetSupplier open={open} onClose={handleCloseDialog} supplier={selectedSupplier}/>

 

    </div>
  )
}

export default SuppliersPage

