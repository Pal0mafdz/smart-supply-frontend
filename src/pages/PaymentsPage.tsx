import { useGetPayments } from "@/api/MySalesApi";
import Spinner from "@/components/Spinner";
import { PaymentTable } from "@/components/tables/PaymentsTable";
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
  const {payments, isLoading} = useGetPayments();
    if(isLoading) return <Spinner/>
  
  return (
    <div className="w-full p-7 space-y-6">

    

    <PaymentTable columns={columns} data={payments??[]}/>
    </div>
  )
}

export default PaymentsPage