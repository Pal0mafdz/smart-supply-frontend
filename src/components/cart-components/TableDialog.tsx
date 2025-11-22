
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { Table } from "@/types";
import { useSetTableAvailable } from "@/api/MyTableApi";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type Props = {
  table?: Table;
  open: boolean;
  onClose: () => void;
};

const TableDialog = ({ table, open, onClose }: Props) => {
  const { setTableAvailable, isLoading } = useSetTableAvailable();

  if (!table) return null;

  const handleSetAvailable = async () => {
    try {
      await setTableAvailable({ id: table._id! });
      toast.success(`Mesa ${table.number} marcada como disponible.`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "No se pudo actualizar la mesa.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Mesa {table.number} cerrada
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-2 text-sm text-stone-600">
          <p>
            Esta mesa se encuentra <span className="font-semibold">cerrada</span>.
          </p>
          <p>
            ¿Quieres marcarla como <span className="font-semibold">disponible</span> para usarla de nuevo?
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSetAvailable} disabled={isLoading}>
            {isLoading ? <Spinner /> : "Cambiar a disponible"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableDialog;
