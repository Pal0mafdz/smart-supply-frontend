import { useMemo, useState } from "react";
import type { Sale } from "@/types";
import { useGetSales } from "@/api/MySalesApi";


import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Spinner from "@/components/Spinner";
import type { ColumnDef } from "@tanstack/react-table";
import { SalesTable } from "@/components/tables/SalesTable";

const formatDateForApi = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

const SalesPage = () => {

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const startDate = useMemo(
    () => formatDateForApi(selectedDate),
    [selectedDate]
  );
  const endDate = startDate; 

  const { sales, isLoading, isError } = useGetSales(startDate, endDate);

  const columns: ColumnDef<Sale>[] = [
    {
      header: "Hora",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const value = row.original.createdAt;
        const date =
          typeof value === "string" || value instanceof Date
            ? new Date(value)
            : null;

        return date
          ? date.toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—";
      },
    },
    {
      header: "Orden",
      accessorKey: "order",
      cell: ({ row }) => {
        const order = row.original.order as any;
        return order?.number ? `#${order.number}` : "—";
      },
    },
    {
      header: "Platillo",
      accessorKey: "recipe",
      cell: ({ row }) =>
        row.original.recipe?.recipename ?? "Sin nombre",
    },
    {
      header: "Precio",
      accessorKey: "price",
      cell: ({ row }) => `$${(row.original.price ?? 0).toFixed(2)}`,
    },
  ];

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Ocurrió un error al cargar las ventas.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">
            Ventas del día
          </h1>
          <p className="text-sm text-stone-500">
            Selecciona una fecha de consulta de ventas
          </p>
        </div>

   
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal bg-white",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                selectedDate.toLocaleDateString("es-MX", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
              ) : (
                <span>Elegir fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

     
      <div>
        <SalesTable columns={columns} data={sales ?? []} />
      </div>
    </div>
  );
};

export default SalesPage;
