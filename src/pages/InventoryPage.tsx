import { useGetProducts } from "@/api/MyProductApi"
import DialogEntry from "@/components/DialogEntry"
import InventoryNav from "@/components/InventoryNav"
import LowStockSupplierAI from "@/components/LowStockSupplierAI"

import Spinner from "@/components/Spinner"
import { DataTable } from "@/components/tables/DataTable"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil} from "lucide-react"
import { useState } from "react"



const InventoryPage = () => {
    const {products, isLoading} = useGetProducts();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [open, setOpen] = useState(false);
    const [showAI, setShowAI] = useState(false);
    // const { exportProducts, isLoading:isExporting } = useExportProductsToExcel();

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
          accessorFn: (row) => row.category?.name?? "Sin categoría",
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
        accessorKey:"minStock",
        header: "Minimo",
    },
    {
      accessorKey:"maxStock",
        header: "Maximo",

    },
      {
          accessorKey:"unitprice",
          header: "Precio/unidad",
          cell: ({ row }) => {
            const value = row.getValue("unitprice") as number;
            return (
              <span>
                ${value.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            );
          },
      },
      {
          accessorKey:"total",
          header: "Total",
          cell: ({ row }) => {
            const value = row.getValue("total") as number;
            return (
              <span>
                ${value.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            );
          },
      },
      {
        id: "actions",
        header: "",
        cell: ({row})=> {
          const product = row.original;
  
     
  
          return(
           
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={()=> handleEdit(product)} title="Editar">
                <Pencil className="h-4 w-4 "/>
              </Button>

            </div>
           
          )
        }
  
  
      }
  
      
  ]

  return (

    
    <div className="w-full p-7 space-y-6">
        
            <InventoryNav/>
          
        
        <div>
            <DataTable columns={columns} data={products ??[]} onClickAi={() => setShowAI(true)}/>

            {selectedProduct && (
              <DialogEntry product={selectedProduct}open={open} onClose={()=> setOpen(false)}/>
            )}
        </div>

        {showAI && (
          <div className="mt-6">
            <LowStockSupplierAI/>
            </div>
        )}

    </div>

    
  )
}

export default InventoryPage