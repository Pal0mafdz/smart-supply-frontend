import { useGetProducts } from "@/api/MyProductApi"
import DialogEntry from "@/components/DialogEntry"
import InventoryNav from "@/components/InventoryNav"
import ProductEntry from "@/components/ProductEntry"
import Spinner from "@/components/Spinner"
import { DataTable } from "@/components/tables/DataTable"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash } from "lucide-react"
import { useState } from "react"



const InventoryPage = () => {
    const {products, isLoading} = useGetProducts();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [open, setOpen] = useState(false);

    const handleEdit = (product: Product)=> {
      setSelectedProduct(product);
      setOpen(true);
    };


    if(isLoading) return <Spinner/>

    const columns: ColumnDef<Product>[] = [
      {
        accessorKey: "codeNum",
        header: "Codigo",
    
      },
      {
        accessorKey:"name",
        header: "Nombre",
      },
      {
          header:"Categoria",
          accessorFn: (row) => row.category.name,
      },
      {
          accessorKey:"unit",
          header: "Unidad",
      },
      {
          accessorKey:"quantityInStock",
          header: "Cantidad",
      },
      {
          accessorKey:"unitprice",
          header: "Precio/unidad",
      },
      {
          accessorKey:"total",
          header: "Total",
      },
      {
        id: "actions",
        header: "",
        cell: ({row})=> {
          const product = row.original;
  
          
          const handleDelete = () => {
  
          };
  
          return(
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={()=> handleEdit(product)} title="Editar">
                <Pencil className="h-4 w-4 "/>
              </Button>
  
              <Button variant="ghost" size="icon" onClick={handleDelete} title="Eliminar">
                <Trash className="h-4 w-4 text-red-400"/>
  
              </Button>
            </div>
          )
        }
  
  
      }
  
      
  ]

  return (

    
    <div className="w-full p-7 space-y-6">
        
            <InventoryNav/>
            
            <ProductEntry/>
        
        
        <div>
            <DataTable columns={columns} data={products ??[]}/>

            {selectedProduct && (
              <DialogEntry product={selectedProduct}open={open} onClose={()=> setOpen(false)}/>
            )}
        </div>

    </div>

    
  )
}

export default InventoryPage