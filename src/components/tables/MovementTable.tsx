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
import { useExportMovementsToExcel } from "@/api/MyMovementsApi"


interface MovementTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function MovementTable<TData, TValue>({
  columns,
  data,
}: MovementTableProps<TData, TValue>) {
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

  const { exportMovements, isLoading:isExporting } = useExportMovementsToExcel();

  return (
    <div>
      <div className="flex items-center justify-between py-4">
      <Input
          placeholder="Filtra por tipo de movimiento"
          value={(table.getColumn("Tipo de Movimiento")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("Tipo de Movimiento")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white border-stone-400"
        />

    <Button  onClick={() => exportMovements()} disabled={isExporting}>
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Generando..." : "Exportar a Excel"}
    </Button>

      </div>
    <div className="overflow-hidden rounded-md border border-stone-400">
      <Table className="bg-white">
        <TableHeader className="bg-slate-500">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    
    </div>
  )
}