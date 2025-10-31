import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Spinner from "./Spinner"
import type { Table } from "@/types"
import { useOpenTable } from "@/api/MyTableApi"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { DialogDescription } from "@radix-ui/react-dialog"

type Props = {
  table?: Table
  open: boolean
  onClose: () => void
}

const OpenTableDialog = ({ table, open, onClose }: Props) => {
  const { openTable, isLoading } = useOpenTable();
  const [customers, setCustomers] = useState<number>(table?.customers || 0)
  const navigate = useNavigate();

  

  if (!table) return null

  const handleOpenTable = async () => {
    try {
      // 

      
      const response = await openTable({
        id: table._id!,
        customers,
      })
       const orderId = response.order;
      
      onClose()

      navigate(`/menu-cart?tableNumber=${table.number}&customers=${customers}&orderId=${orderId}`);
    

    } catch (error: any) {
      toast.error(error.message || "No se pudo abrir la mesa.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Abrir mesa {table.number}
          </DialogTitle>
        </DialogHeader>


        <div className="space-y-4 py-2">
        <DialogDescription>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Número de personas sentadas
            </label>
            <Input
              type="number"
              min={1}
              max={table.capacity}
              value={customers}
              onChange={(e) => setCustomers(Number(e.target.value))}
              placeholder="Ej. 4"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Capacidad máxima: {table.capacity}
            </p>
          </div>
          </DialogDescription>
        </div>
        

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleOpenTable}
            disabled={isLoading || customers < 1}
          >
            {isLoading ? <Spinner/> : "Abrir mesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OpenTableDialog
