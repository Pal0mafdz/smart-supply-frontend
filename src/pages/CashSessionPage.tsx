// import { useState, useMemo, useEffect } from "react";
// import { useGetSales } from "@/api/MyOrderApi";
// import Spinner from "@/components/Spinner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import {
//   useGetCurrentCashSession,
//   useOpenCashSession,
//   useCloseCashSession,
// } from "@/api/MyCashSessionApi";

// type CashSessionState = "sin-sesion" | "abierta" | "cerrada";

// const formatCurrency = (value: number) =>
//   value.toLocaleString("es-MX", {
//     style: "currency",
//     currency: "MXN",
//     minimumFractionDigits: 2,
//   });


  

// const todayISO = () => new Date().toISOString()// yyyy-mm-dd

// const CashSessionPage = () => {
//   const [date, setDate] = useState(todayISO);
//   const { sales, isLoading: salesLoading } = useGetSales();
//   const {
//     cashSession,
//     isLoading: cashLoading,
//   } = useGetCurrentCashSession(date);

//   const { openCash, isLoading: openLoading } = useOpenCashSession();
//   const { closeCash, isLoading: closeLoading } = useCloseCashSession();

//   const [openingAmount, setOpeningAmount] = useState<number>(0);
//   const [realClosingAmount, setRealClosingAmount] = useState<number | "">("");
//   const [note, setNote] = useState("");
//   const [openedAt, setOpenedAt] = useState<Date | null>(null);
//   const [closedAt, setClosedAt] = useState<Date | null>(null);

//   // Derivar estado visual desde la sesión real
//   const state: CashSessionState = !cashSession
//     ? "sin-sesion"
//     : cashSession.status === "abierta"
//     ? "abierta"
//     : "cerrada";

//   // Sincronizar datos locales con la sesión real cada vez que cambie
//   useEffect(() => {
//     if (cashSession) {
//       setOpeningAmount(cashSession.openingAmount ?? 0);
//       setOpenedAt(
//         cashSession.openedAt ? new Date(cashSession.openedAt) : null
//       );
//       setClosedAt(
//         cashSession.closedAt ? new Date(cashSession.closedAt) : null
//       );
//       if (cashSession.closingAmount != null) {
//         setRealClosingAmount(cashSession.closingAmount);
//       } else {
//         setRealClosingAmount("");
//       }
//       setNote(cashSession.note ?? "");
//     } else {
//       setOpeningAmount(0);
//       setOpenedAt(null);
//       setClosedAt(null);
//       setRealClosingAmount("");
//       setNote("");
//     }
//   }, [cashSession]);

//   const {
//     totalSalesAllForDay,
//     totalCashForDay,
//   } = useMemo(() => {
//     if (!sales) {
//       return {
//         totalSalesAllForDay: 0,
//         totalCashForDay: 0,
//       };
//     }
  
//     return sales.reduce(
//       (acc, sale: any) => {
//         const saleDateRaw = sale.createdAt ?? sale.date;
//         if (!saleDateRaw) return acc;
  
//         const saleDate = new Date(saleDateRaw);
//         const saleDay = saleDate.toISOString().slice(0, 10); // yyyy-mm-dd
  
//         if (saleDay !== date) return acc;
  
//         const total = Number(sale.total ?? sale.amount ?? 0);
//         if (isNaN(total)) return acc;
  
//         const isCash =
//           sale.paymentMethod === "efectivo" ||
//           sale.paymentType === "efectivo"; // ajusta al nombre real de tu campo
  
//         return {
//           totalSalesAllForDay: acc.totalSalesAllForDay + total,
//           totalCashForDay: acc.totalCashForDay + (isCash ? total : 0),
//         };
//       },
//       {
//         totalSalesAllForDay: 0,
//         totalCashForDay: 0,
//       }
//     );
//   }, [sales, date]);
  
//   // Ventas del día (todas las formas de pago)
//   const totalSalesForDay = totalSalesAllForDay;
  
//   // 💵 Efectivo esperado = apertura + solo ventas en efectivo
//   const expectedClosing = openingAmount + totalCashForDay;
  
//   // Diferencia sigue igual
//   const difference =
//     realClosingAmount === "" ? 0 : Number(realClosingAmount) - expectedClosing;
  

//   // const totalSalesForDay = useMemo(() => {
//   //   if (!sales) return 0;

//   //   return sales.reduce((sum, sale: any) => {
//   //     const saleDateRaw = sale.createdAt ?? sale.date;
//   //     if (!saleDateRaw) return sum;

//   //     const saleDate = new Date(saleDateRaw);
//   //     const saleDay = saleDate.toISOString().slice(0, 10); // yyyy-mm-dd

//   //     if (saleDay !== date) return sum;

//   //     const total = Number(sale.total ?? sale.amount ?? 0);
//   //     return sum + (isNaN(total) ? 0 : total);
//   //   }, 0);
//   // }, [sales, date]);

//   // const expectedClosing = openingAmount + totalSalesForDay;
//   // const difference =
//   //   realClosingAmount === "" ? 0 : Number(realClosingAmount) - expectedClosing;

//   const handleOpen = async () => {
//     if (openingAmount < 0) {
//       toast.error("El monto de apertura no puede ser negativo");
//       return;
//     }

//     try {
//       await openCash({ openingAmount, date });
//       toast.success("Caja abierta para el día " + date);
//       // El estado se refresca vía react-query (invalidateQueries)
//     } catch (e: any) {
//       toast.error(e?.message || "Error al abrir la caja");
//     }
//   };

//   const handleClose = async () => {
//     if (realClosingAmount === "") {
//       toast.error("Ingresa el efectivo real al cierre");
//       return;
//     }

//     try {
//       const blob = await closeCash({
//         realClosingAmount: Number(realClosingAmount),
//         note,
//         date,
//       });

//       // Descargar Excel que viene del backend
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `cierre-caja-${date}.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       toast.success("Caja cerrada y reporte descargado");
//       // Después de cerrar, react-query recarga la sesión (ya cerrada)
//     } catch (e: any) {
//       toast.error(e?.message || "Error al cerrar la caja");
//     }
//   };

//   // Reset solo limpia formulario cuando NO hay sesión en backend
//   const resetSession = () => {
//     if (!cashSession) {
//       setOpeningAmount(0);
//       setRealClosingAmount("");
//       setNote("");
//       setOpenedAt(null);
//       setClosedAt(null);
//     }
//   };

//   if (salesLoading || cashLoading) return <Spinner />;

//   return (
//     <div className="space-y-8">
//       <header className="space-y-1">
//         <h1 className="text-2xl font-semibold tracking-tight">
//           Apertura y Cierre de Caja
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           Registra las ventas del día y calcula el cierre de caja con sobrante
//           o faltante. Al cerrar la caja se genera un reporte descargable.
//         </p>
//       </header>

//       {/* Fila superior: fecha + estado */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-muted-foreground">
//             Día de la jornada
//           </label>
//           <Input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full md:w-60"
//           />
//         </div>

//         <div className="flex flex-col md:items-end gap-2">
//           <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
//             <span
//               className={`h-2 w-2 rounded-full ${
//                 state === "abierta"
//                   ? "bg-emerald-500"
//                   : state === "cerrada"
//                   ? "bg-amber-500"
//                   : "bg-stone-400"
//               }`}
//             />
//             <span>
//               Estado:{" "}
//               {state === "abierta"
//                 ? "Caja abierta"
//                 : state === "cerrada"
//                 ? "Cerrada (resumen disponible)"
//                 : "Sin apertura registrada"}
//             </span>
//           </div>
//           {openedAt && (
//             <p className="text-xs text-muted-foreground">
//               Apertura: {openedAt.toLocaleTimeString("es-MX")}
//               {closedAt && ` · Cierre: ${closedAt.toLocaleTimeString("es-MX")}`}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Tarjetas resumen */}
//       <section className="grid gap-4 sm:grid-cols-3">
//         <div className="rounded-xl border bg-card p-4">
//           <p className="text-xs uppercase text-muted-foreground">Apertura</p>
//           <p className="mt-1 text-lg font-semibold">
//             {formatCurrency(openingAmount)}
//           </p>
//           <p className="mt-1 text-xs text-muted-foreground">
//             Efectivo inicial en caja
//           </p>
//         </div>
//         <div className="rounded-xl border bg-card p-4">
//           <p className="text-xs uppercase text-muted-foreground">
//             Ventas del día
//           </p>
//           <p className="mt-1 text-lg font-semibold">
//             {formatCurrency(totalSalesForDay)}
//           </p>
//           <p className="mt-1 text-xs text-muted-foreground">
//             Pagos del dia ({date})
//           </p>
//         </div>
//         <div className="rounded-xl border bg-card p-4">
//           <p className="text-xs uppercase text-muted-foreground">
//             Efectivo esperado
//           </p>
//           <p className="mt-1 text-lg font-semibold">
//             {formatCurrency(expectedClosing)}
//           </p>
//           <p className="mt-1 text-xs text-muted-foreground">
//             Monto de apertura y efectivo del dia
//           </p>
//         </div>
//       </section>

//       {/* Formulario apertura / cierre */}
//       <section className="grid gap-6 md:grid-cols-2">
//         {/* Apertura */}
//         <div className="space-y-4 rounded-xl border bg-card p-5">
//           <h2 className="text-base font-semibold">Apertura de caja</h2>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">
//               Monto de apertura (efectivo inicial)
//             </label>
//             <Input
//               type="number"
//               min={0}
//               step="0.01"
//               value={openingAmount}
//               onChange={(e) =>
//                 setOpeningAmount(Number(e.target.value) || 0)
//               }
//               disabled={state !== "sin-sesion" || openLoading}
//             />
//           </div>

//           <Button
//             className="w-full md:w-auto"
//             onClick={handleOpen}
//             disabled={state !== "sin-sesion" || openLoading}
//           >
//             {openLoading
//               ? "Abriendo..."
//               : state === "abierta"
//               ? "Caja ya abierta"
//               : state === "cerrada"
//               ? "Caja cerrada"
//               : "Abrir caja"}
//           </Button>
//         </div>

//         {/* Cierre */}
//         <div className="space-y-4 rounded-xl border bg-card p-5">
//           <h2 className="text-base font-semibold">Cierre de caja</h2>
//           <div className="space-y-2">
//             <label className="text-sm font-medium">
//               Efectivo real en caja al cierre
//             </label>
//             <Input
//               type="number"
//               min={0}
//               step="0.01"
//               value={realClosingAmount}
//               onChange={(e) =>
//                 setRealClosingAmount(
//                   e.target.value === "" ? "" : Number(e.target.value)
//                 )
//               }
//               disabled={state !== "abierta" || closeLoading}
//             />
//           </div>

//           <div className="space-y-1 text-sm">
//             <p className="text-muted-foreground">
//               Diferencia vs esperado:
//               <span
//                 className={`ml-2 font-semibold ${
//                   difference === 0
//                     ? "text-emerald-600"
//                     : difference > 0
//                     ? "text-amber-600"
//                     : "text-rose-600"
//                 }`}
//               >
//                 {realClosingAmount === ""
//                   ? " —"
//                   : `${difference > 0 ? "+" : ""}${formatCurrency(
//                       difference
//                     )}`}
//               </span>
//             </p>
//             <p className="text-xs text-muted-foreground">
//               Positivo = sobrante, negativo = faltante.
//             </p>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Notas</label>
//             <Textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder="Ejemplo: faltan $50, posible error de cambio en mesa 3..."
//               rows={3}
//               disabled={state === "sin-sesion"}
//             />
//           </div>

//           <div className="flex flex-col gap-2 sm:flex-row">
//             <Button
//               className="flex-1"
//               variant="default"
//               onClick={handleClose}
//               disabled={state !== "abierta" || closeLoading}
//             >
//               {closeLoading ? "Cerrando..." : "Cerrar caja y descargar reporte"}
//             </Button>
//             <Button
//               className="flex-1"
//               variant="outline"
//               onClick={resetSession}
//               disabled={!!cashSession}
//             >
//               Reiniciar formulario
//             </Button>
//           </div>
//         </div>
//       </section>

//       {state === "cerrada" && (
//         <section className="rounded-xl border bg-card p-5 space-y-2">
//           <h2 className="text-base font-semibold">Resumen de la jornada</h2>
//           <p className="text-sm text-muted-foreground">
//             Día {date}. Apertura:{" "}
//             {openedAt?.toLocaleTimeString("es-MX") ?? "—"} · Cierre:{" "}
//             {closedAt?.toLocaleTimeString("es-MX") ?? "—"}
//           </p>
//           <ul className="mt-2 text-sm space-y-1">
//             <li>Apertura: {formatCurrency(openingAmount)}</li>
//             <li>Ventas del día: {formatCurrency(totalSalesForDay)}</li>
//             <li>Efectivo esperado: {formatCurrency(expectedClosing)}</li>
//             <li>
//               Efectivo real:{" "}
//               {formatCurrency(Number(realClosingAmount) || 0)}
//             </li>
//             <li>
//               Diferencia:{" "}
//               <span
//                 className={
//                   difference === 0
//                     ? "text-emerald-600"
//                     : difference > 0
//                     ? "text-amber-600"
//                     : "text-rose-600"
//                 }
//               >
//                 {difference > 0 ? "+" : ""}
//                 {formatCurrency(difference)}
//               </span>
//             </li>
//           </ul>
//           {note && (
//             <p className="mt-2 text-sm">
//               <span className="font-medium">Notas:</span> {note}
//             </p>
//           )}
//         </section>
//       )}
//     </div>
//   );
// };

// export default CashSessionPage;

"use client"

import { useState, useMemo, useEffect } from "react";
import { useGetSales } from "@/api/MyOrderApi";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useGetCurrentCashSession,
  useOpenCashSession,
  useCloseCashSession,
} from "@/api/MyCashSessionApi";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

type CashSessionState = "sin-sesion" | "abierta" | "cerrada";

// Helper para fecha local
const getLocalDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// Helper para enviar al backend
const formatForBackend = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatCurrency = (value: number) =>
  value.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  });

const CashSessionPage = () => {
  const [date, setDate] = useState<Date>(getLocalDate());
  const dateISO = formatForBackend(date);

  const { sales, isLoading: salesLoading } = useGetSales();
  const { cashSession, isLoading: cashLoading } = useGetCurrentCashSession(dateISO);

  const { openCash, isLoading: openLoading } = useOpenCashSession();
  const { closeCash, isLoading: closeLoading } = useCloseCashSession();

  const [openingAmount, setOpeningAmount] = useState<number>(0);
  const [realClosingAmount, setRealClosingAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [openedAt, setOpenedAt] = useState<Date | null>(null);
  const [closedAt, setClosedAt] = useState<Date | null>(null);

  const state: CashSessionState = !cashSession
    ? "sin-sesion"
    : cashSession.status === "abierta"
    ? "abierta"
    : "cerrada";

  // Sincronizar datos locales con la sesión real
  useEffect(() => {
    if (cashSession) {
      setOpeningAmount(cashSession.openingAmount ?? 0);
      setOpenedAt(cashSession.openedAt ? new Date(cashSession.openedAt) : null);
      setClosedAt(cashSession.closedAt ? new Date(cashSession.closedAt) : null);
      setRealClosingAmount(
        cashSession.closingAmount != null ? cashSession.closingAmount : ""
      );
      setNote(cashSession.note ?? "");
    } else {
      setOpeningAmount(0);
      setOpenedAt(null);
      setClosedAt(null);
      setRealClosingAmount("");
      setNote("");
    }
  }, [cashSession]);

  const { totalSalesAllForDay, totalCashForDay } = useMemo(() => {
    if (!sales) return { totalSalesAllForDay: 0, totalCashForDay: 0 };

    return sales.reduce(
      (acc, sale: any) => {
        const saleDateRaw = sale.createdAt ?? sale.date;
        if (!saleDateRaw) return acc;

        const saleDate = new Date(saleDateRaw);
        const saleDay = formatForBackend(saleDate);

        if (saleDay !== dateISO) return acc;

        const total = Number(sale.total ?? sale.amount ?? 0);
        if (isNaN(total)) return acc;

        const isCash =
          sale.paymentMethod === "efectivo" || sale.paymentType === "efectivo";

        return {
          totalSalesAllForDay: acc.totalSalesAllForDay + total,
          totalCashForDay: acc.totalCashForDay + (isCash ? total : 0),
        };
      },
      { totalSalesAllForDay: 0, totalCashForDay: 0 }
    );
  }, [sales, dateISO]);

  const totalSalesForDay = totalSalesAllForDay;
  const expectedClosing = openingAmount + totalCashForDay;
  const difference =
    realClosingAmount === "" ? 0 : Number(realClosingAmount) - expectedClosing;

  const handleOpen = async () => {
    if (openingAmount < 0) {
      toast.error("El monto de apertura no puede ser negativo");
      return;
    }

    try {
      await openCash({ openingAmount, date: dateISO });
      toast.success("Caja abierta para el día " + dateISO);
    } catch (e: any) {
      toast.error(e?.message || "Error al abrir la caja");
    }
  };

  // const handleClose = async () => {
  //   if (realClosingAmount === "") {
  //     toast.error("Ingresa el efectivo real al cierre");
  //     return;
  //   }

  //   try {
  //     const blob = await closeCash({
  //       realClosingAmount: Number(realClosingAmount),
  //       note,
  //       date: dateISO,
  //     });

  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `cierre-caja-${dateISO}.xlsx`;
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);

  //     toast.success("Caja cerrada con exito");
  //   } catch (e: any) {
  //     toast.error(e?.message || "Error al cerrar la caja");
  //   }
  // };

  const handleClose = async () => {
    if (realClosingAmount === "") {
      toast.error("Ingresa el efectivo real al cierre");
      return;
    }
  
    try {
      await closeCash({
        realClosingAmount: Number(realClosingAmount),
        note,
        date: dateISO,
      });
  
      toast.success("Caja cerrada con éxito");
    } catch (e: any) {
      toast.error(e?.message || "Error al cerrar la caja");
    }
  };
  

  const resetSession = () => {
    if (!cashSession) {
      setOpeningAmount(0);
      setRealClosingAmount("");
      setNote("");
      setOpenedAt(null);
      setClosedAt(null);
    }
  };

  if (salesLoading || cashLoading) return <Spinner />;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Apertura y Cierre de Caja
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra las ventas del día y calcula el cierre de caja con sobrante
          o faltante. 
        </p>
      </header>

      {/* Selector de fecha igual a DashboardHeader */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
         
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                disabled={(d) => d > getLocalDate()}
                onSelect={(d) => {
                  if (!d) return;
                  if (d > getLocalDate()) return;
                  setDate(d);
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                state === "abierta"
                  ? "bg-emerald-500"
                  : state === "cerrada"
                  ? "bg-amber-500"
                  : "bg-stone-400"
              }`}
            />
            <span>
              Estado:{" "}
              {state === "abierta"
                ? "Caja abierta"
                : state === "cerrada"
                ? "Cerrada (resumen disponible)"
                : "Sin apertura registrada"}
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
            Pagos del día ({dateISO})
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
            Monto de apertura y efectivo del día
          </p>
        </div>
      </section>

   
      <section className="grid gap-6 md:grid-cols-2">
 
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
              onChange={(e) => setOpeningAmount(Number(e.target.value) || 0)}
              disabled={state !== "sin-sesion" || openLoading}
            />
          </div>

          <Button
            className="w-full md:w-auto"
            onClick={handleOpen}
            disabled={state !== "sin-sesion" || openLoading}
          >
            {openLoading
              ? "Abriendo..."
              : state === "abierta"
              ? "Caja ya abierta"
              : state === "cerrada"
              ? "Caja cerrada"
              : "Abrir caja"}
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
              disabled={state !== "abierta" || closeLoading}
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
              disabled={state === "sin-sesion"}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1"
              variant="default"
              onClick={handleClose}
              disabled={state !== "abierta" || closeLoading}
            >
              {closeLoading ? "Cerrando..." : "Cerrar caja"}
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={resetSession}
              disabled={!!cashSession}
            >
              Reiniciar formulario
            </Button>
          </div>
        </div>
      </section>

      {state === "cerrada" && (
        <section className="rounded-xl border bg-card p-5 space-y-2">
          <h2 className="text-base font-semibold">Resumen de la jornada</h2>
          <p className="text-sm text-muted-foreground">
            Día {dateISO}. Apertura:{" "}
            {openedAt?.toLocaleTimeString("es-MX") ?? "—"} · Cierre:{" "}
            {closedAt?.toLocaleTimeString("es-MX") ?? "—"}
          </p>
          <ul className="mt-2 text-sm space-y-1">
            <li>Apertura: {formatCurrency(openingAmount)}</li>
            <li>Ventas del día: {formatCurrency(totalSalesForDay)}</li>
            <li>Efectivo esperado: {formatCurrency(expectedClosing)}</li>
            <li>Efectivo real: {formatCurrency(Number(realClosingAmount) || 0)}</li>
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



