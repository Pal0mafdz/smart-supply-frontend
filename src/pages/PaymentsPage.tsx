import type { Payment } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: "Monto",

  },
  {
    accessorKey: "method",
    header: "Metodo de pago",

  },
  {
    accessorKey: "reference",
    header: "Referencia",

  },
 
  
    {
      header: "Fecha de pago",
      accessorFn: (row) => {
        const date = new Date(row.paidAt);
        return date.toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    }
  
]

const PaymentsPage = () => {
  return (
    <div>PaymentsPage</div>
  )
}

export default PaymentsPage