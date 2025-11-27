"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import React from "react"
import { Input } from "../ui/input"
import { Download } from "lucide-react"
import { useExportProductsToExcel } from "@/api/MyProductApi"
import ProductEntry from "../ProductEntry"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onClickAi?: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onClickAi,
}: DataTableProps<TData, TValue>) {
  // const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      
      columnFilters,
    },
   
  })

  const { exportProducts, isLoading:isExporting } = useExportProductsToExcel();



  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtra por categoría"
          value={(table.getColumn("Categoria")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Categoria")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white border-stone-400"
        />
        <div className="flex items-center gap-3">
          <ProductEntry />
          <Button onClick={() => exportProducts()} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Generando..." : "Exportar a Excel"}
          </Button>

          {onClickAi && (
            <Button variant="outline" onClick={onClickAi}>Generar Recomendacion</Button>
          )}
        </div>



</div>
     
    <div className="overflow-hidden rounded-md border border-stone-400">
      <Table className="bg-white">
        <TableHeader className="bg-slate-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay productos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          className="bg-white"
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          className="bg-white"
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    
    </div>
  )
}