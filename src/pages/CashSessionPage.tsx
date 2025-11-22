import { useState, useMemo } from "react";
import { useGetSales } from "@/api/MyOrderApi";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type CashSessionState = "closed" | "open" | "closed-with-summary";

const formatCurrency = (value: number) =>
  value.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });

const todayISO = () => new Date().toISOString().slice(0, 10); // yyyy-mm-dd

const CashSessionPage = () => {
  const { sales, isLoading } = useGetSales();
  const [date, setDate] = useState(todayISO);
  const [openingAmount, setOpeningAmount] = useState<number>(0);
  const [realClosingAmount, setRealClosingAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<CashSessionState>("closed");
  const [openedAt, setOpenedAt] = useState<Date | null>(null);
  const [closedAt, setClosedAt] = useState<Date | null>(null);


  const totalSalesForDay = useMemo(() => {
    if (!sales) return 0;

    return sales.reduce((sum, sale: any) => {
      const saleDateRaw = sale.createdAt ?? sale.date;
      if (!saleDateRaw) return sum;

      const saleDate = new Date(saleDateRaw);
      const saleDay = saleDate.toISOString().slice(0, 10); // yyyy-mm-dd

      if (saleDay !== date) return sum;

      const total = Number(sale.total ?? sale.amount ?? 0);
      return sum + (isNaN(total) ? 0 : total);
    }, 0);
  }, [sales, date]);

  const expectedClosing = openingAmount + totalSalesForDay;
  const difference =
    realClosingAmount === "" ? 0 : Number(realClosingAmount) - expectedClosing;

  const handleOpen = () => {
    if (openingAmount < 0) {
      toast.error("El monto de apertura no puede ser negativo");
      return;
    }
    setState("open");
    setOpenedAt(new Date());
    setClosedAt(null);
    setRealClosingAmount("");
    setNote("");
    toast.success("Caja abierta para el día " + date);
  };

  const handleClose = () => {
    if (realClosingAmount === "") {
      toast.error("Ingresa el efectivo real al cierre");
      return;
    }
    setState("closed-with-summary");
    setClosedAt(new Date());
    toast.success("Caja cerrada. Revisa el resumen de la jornada.");
  };

  const resetSession = () => {
    setState("closed");
    setOpeningAmount(0);
    setRealClosingAmount("");
    setNote("");
    setOpenedAt(null);
    setClosedAt(null);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Apertura y Cierre de Caja
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra las ventas del día y calcula el cierre de
          caja con sobrante o faltante.
        </p>
      </header>

      {/* Fila superior: fecha + estado */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Día de la jornada
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full md:w-60"
          />
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                state === "open"
                  ? "bg-emerald-500"
                  : state === "closed-with-summary"
                  ? "bg-amber-500"
                  : "bg-stone-400"
              }`}
            />
            <span>
              Estado:{" "}
              {state === "open"
                ? "Caja abierta"
                : state === "closed-with-summary"
                ? "Cerrada (resumen disponible)"
                : "Cerrada"}
            </span>
          </div>
          {openedAt && (
            <p className="text-xs text-muted-foreground">
              Apertura: {openedAt.toLocaleTimeString("es-MX")}
              {closedAt && ` · Cierre: ${closedAt.toLocaleTimeString("es-MX")}`}
            </p>
          )}
        </div>
      </div>

      {/* Tarjetas resumen */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Apertura</p>
          <p className="mt-1 text-lg font-semibold">
            {formatCurrency(openingAmount)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Efectivo inicial en caja
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">
            Ventas del día
          </p>
          <p className="mt-1 text-lg font-semibold">
            {formatCurrency(totalSalesForDay)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Calculado a partir de las ventas registradas ({date})
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">
            Efectivo esperado
          </p>
          <p className="mt-1 text-lg font-semibold">
            {formatCurrency(expectedClosing)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Apertura + ventas del día
          </p>
        </div>
      </section>

      {/* Formulario apertura / cierre */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Apertura */}
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">Apertura de caja</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Monto de apertura (efectivo inicial)
            </label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={openingAmount}
              onChange={(e) =>
                setOpeningAmount(Number(e.target.value) || 0)
              }
              disabled={state === "open"}
            />
          </div>

          <Button
            className="w-full md:w-auto"
            onClick={handleOpen}
            disabled={state === "open"}
          >
            {state === "open" ? "Caja ya abierta" : "Abrir caja"}
          </Button>
        </div>

        {/* Cierre */}
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <h2 className="text-base font-semibold">Cierre de caja</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Efectivo real en caja al cierre
            </label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={realClosingAmount}
              onChange={(e) =>
                setRealClosingAmount(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              disabled={state === "closed"}
            />
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              Diferencia vs esperado:
              <span
                className={`ml-2 font-semibold ${
                  difference === 0
                    ? "text-emerald-600"
                    : difference > 0
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                {realClosingAmount === ""
                  ? " —"
                  : `${difference > 0 ? "+" : ""}${formatCurrency(
                      difference
                    )}`}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Positivo = sobrante, negativo = faltante.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notas</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ejemplo: faltan $50, posible error de cambio en mesa 3..."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1"
              variant="default"
              onClick={handleClose}
              disabled={state !== "open"}
            >
              Cerrar caja
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={resetSession}
            >
              Reiniciar simulación
            </Button>
          </div>
        </div>
      </section>

     
      {state === "closed-with-summary" && (
        <section className="rounded-xl border bg-card p-5 space-y-2">
          <h2 className="text-base font-semibold">Resumen de la jornada</h2>
          <p className="text-sm text-muted-foreground">
            Día {date}. Apertura:{" "}
            {openedAt?.toLocaleTimeString("es-MX") ?? "—"} · Cierre:{" "}
            {closedAt?.toLocaleTimeString("es-MX") ?? "—"}
          </p>
          <ul className="mt-2 text-sm space-y-1">
            <li>Apertura: {formatCurrency(openingAmount)}</li>
            <li>Ventas del día: {formatCurrency(totalSalesForDay)}</li>
            <li>Efectivo esperado: {formatCurrency(expectedClosing)}</li>
            <li>
              Efectivo real:{" "}
              {formatCurrency(Number(realClosingAmount) || 0)}
            </li>
            <li>
              Diferencia:{" "}
              <span
                className={
                  difference === 0
                    ? "text-emerald-600"
                    : difference > 0
                    ? "text-amber-600"
                    : "text-rose-600"
                }
              >
                {difference > 0 ? "+" : ""}
                {formatCurrency(difference)}
              </span>
            </li>
          </ul>
          {note && (
            <p className="mt-2 text-sm">
              <span className="font-medium">Notas:</span> {note}
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default CashSessionPage;
