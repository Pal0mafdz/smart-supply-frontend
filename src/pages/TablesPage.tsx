import * as React from "react";
import { useGetTables } from "@/api/MyTableApi";
import Spinner from "@/components/Spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Table } from "@/types";
import TableLayout from "@/components/TableLayout";
import { useState } from "react";
import OpenTableDialog from "@/components/OpenTableDialog";
import { useNavigate } from "react-router-dom";

const CANVAS_BG = "bg-[#eeedec]";

const StatusLegend = () => (
  <div className="flex items-center gap-6 text-sm">
    <LegendItem color="bg-teal" label="Disponible" />
    <LegendItem color="bg-stone-600" label="Reservada" />
    <LegendItem color="bg-amber" label="Abierta" />
    <LegendItem color="bg-orange" label="Cerrada" />
  </div>
);

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
    <span className="text-stone-600">{label}</span>
  </div>
);


const TablesPage = () => {
  const navigate = useNavigate();
  const { tables, isLoading } = useGetTables();
  const [selectedTable, setSelectedTable] = useState<Table | undefined>();
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickTable = (table: Table) => {
    if(table.state === "abierta"){
      // setOpenDialog(false);
      // setSelectedTable(undefined);
      // navigate(`/menu-cart?tableNumber=${table.number}&customers=${table.customers}&orderId=${table.order}`);
        
      setOpenDialog(false);
      setSelectedTable(undefined);
      requestAnimationFrame(() => {
        navigate(
          `/menu-cart?tableNumber=${table.number}&customers=${table.customers}&orderId=${table.order}`
        );
      });
    }else{
    
    setSelectedTable(table);
    setOpenDialog(true);
  }
  };

  const [activeState, setActiveState] = React.useState<
    "Area Principal" | Table["area"]
  >("Area Principal");

  const filtered = React.useMemo(() => {
    return tables?.filter((t: Table) => t.area === activeState) ?? [];
  }, [tables, activeState]);

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen flex flex-col w-full px-6 md:px-8 pt-6 pb-24 space-y-6"> 
  

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
          Mesas en el Restaurante
        </h1>
        <StatusLegend />
        
      </div>

      <Tabs value={activeState} onValueChange={(v: any) => setActiveState(v)}>
        <TabsList className="flex-wrap gap-2 bg-transparent p-0">
          <TabsTrigger
            value="Area Principal"
            className="rounded-xl data-[state=active]:bg-stone-900 data-[state=active]:text-stone-100
                       data-[state=inactive]:bg-white data-[state=inactive]:text-stone-700
                       border border-stone-300 px-4"
          >
            Area Principal
          </TabsTrigger>
          <TabsTrigger
            value="Terraza"
            className="rounded-xl data-[state=active]:bg-stone-900 data-[state=active]:text-stone-100
                       data-[state=inactive]:bg-white data-[state=inactive]:text-stone-700
                       border border-stone-300 px-4"
          >
            Terraza
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeState} className="mt-6 flex-1">
          <div
            className={[
              "rounded-2xl p-8 md:p-10 border border-stone-300",
              CANVAS_BG,
            ].join(" ")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-14 gap-y-20 place-items-center">
              {filtered.map((table: Table) => (
                <TableLayout
                  onClick={() => handleClickTable(table)}
                  key={table._id ?? table.number}
                  table={table}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <OpenTableDialog
        table={selectedTable}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default TablesPage