import { useGetPayments } from "@/api/MySalesApi";
import Spinner from "@/components/Spinner";
import { PaymentTable } from "@/components/tables/PaymentsTable";
import type { Payment } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: "Monto",
    cell: ({ row }) => {
      const value = row.getValue("amount") as number;
      return `$${value.toFixed(2)}`;
    },
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
  
    header: "Cajero",
    accessorFn: (row) => row.cashier?.name ?? "—",
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
      <h1 className="text-2xl font-semibold text-stone-800">
            Pagos
          </h1>

    

    <PaymentTable columns={columns} data={payments??[]}/>
    </div>
  )
}

export default PaymentsPage