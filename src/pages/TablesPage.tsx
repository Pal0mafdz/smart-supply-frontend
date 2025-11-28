import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetTables } from "@/api/MyTableApi";
import { useGetCurrentCashSession } from "@/api/MyCashSessionApi";

import Spinner from "@/components/Spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import type { Table } from "@/types";
import TableLayout from "@/components/TableLayout";
import OpenTableDialog from "@/components/OpenTableDialog";
import TableDialog from "@/components/cart-components/TableDialog";

import { AlertTriangle } from "lucide-react";

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

const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // yyyy-mm-dd en hora local
};


// const todayISO = () => new Date().toISOString().slice(0, 10); // yyyy-mm-dd

const TablesPage = () => {
  const navigate = useNavigate();
  const { tables, isLoading } = useGetTables();

  // Estado de caja para HOY
  const today = todayISO();
  const {
    cashSession,
    isLoading: cashLoading,
  } = useGetCurrentCashSession(today);

  const isCashOpen = cashSession?.status === "abierta";

  const [selectedTable, setSelectedTable] = useState<Table | undefined>();
  const [openDialog, setOpenDialog] = useState(false);
  const [openAvailableDialog, setOpenAvailableDialog] = useState(false);

  const [activeState, setActiveState] = React.useState<
    "Area Principal" | Table["area"]
  >("Area Principal");

  const filtered = React.useMemo(() => {
    return tables?.filter((t: Table) => t.area === activeState) ?? [];
  }, [tables, activeState]);

  const handleClickTable = (table: Table) => {
    // Si por alguna razón se llega a esta función con caja cerrada, mejor no hacer nada
    if (!isCashOpen) return;

    if (table.state === "abierta") {
      setOpenDialog(false);
      setOpenAvailableDialog(false);
      setSelectedTable(undefined);

      // pequeño hack para que cierre bien el dialog antes de navegar
      requestAnimationFrame(() => {
        navigate(
          `/menu-cart?tableNumber=${table.number}&customers=${table.customers}&orderId=${table.order}`
        );
      });
      return;
    }

    // Mesa cerrada → dialog para marcar como disponible
    if (table.state === "cerrada") {
      setSelectedTable(table);
      setOpenAvailableDialog(true);
      return;
    }

    // Mesa disponible o reservada → dialog para abrir mesa
    setSelectedTable(table);
    setOpenDialog(true);
  };

  if (isLoading || cashLoading) return <Spinner />;

  // 🔒 Caja cerrada → no se muestran mesas, solo aviso
  if (!isCashOpen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 p-3">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-stone-900">
            Caja cerrada
          </h1>
          <p className="text-sm text-muted-foreground">
            Para abrir mesas y tomar órdenes, primero debes abrir la caja del
            día en el módulo de <span className="font-medium">Caja</span>.
          </p>
          <p className="text-xs text-muted-foreground">
            Día seleccionado: <span className="font-semibold">{today}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-2">
            <Button
              className="sm:w-auto"
              onClick={() => navigate("/cash")}
            >
              Ir a Caja
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Caja abierta → UI normal de mesas
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
      <TableDialog
        table={selectedTable}
        open={openAvailableDialog}
        onClose={() => setOpenAvailableDialog(false)}
      />
    </div>
  );
};

export default TablesPage;
