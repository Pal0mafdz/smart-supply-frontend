
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { PaymentMethod } from "@/api/MySalesApi"; // o tu archivo de api

type PaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  defaultMethod?: PaymentMethod;
  isSubmitting?: boolean;
  onConfirm: (data: {
    method: PaymentMethod;
    amount: number;
    reference?: string;
  }) => void | Promise<void>;
};

const quickAmounts = [50, 100, 200, 500];

const PaymentDialog = ({
  open,
  onOpenChange,
  total,
  items,
  defaultMethod = "efectivo",
  isSubmitting,
  onConfirm,
}: PaymentDialogProps) => {
  const [method, setMethod] = React.useState<PaymentMethod>(defaultMethod);
  const [amount, setAmount] = React.useState<string>(total.toFixed(2));
  const [reference, setReference] = React.useState<string>("");

  React.useEffect(() => {
    if (open) {
      setMethod(defaultMethod);
      setAmount(total.toFixed(2));
      setReference("");
    }
  }, [open, defaultMethod, total]);

  // const handleConfirm = async () => {
  //   const numericAmount = parseFloat(amount || "0");
  //   if (Number.isNaN(numericAmount) || numericAmount <= 0) return;

  //   await onConfirm({
  //     method,
  //     amount: numericAmount,
  //     reference: reference.trim() || undefined,
  //   });
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-full !max-w-[900px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  

        <div className="flex flex-col  ">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Pago</DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              Revisa los productos y registra el pago.
            </DialogDescription>
          </DialogHeader>
  
          <div className="text-xs font-semibold text-stone-500 mt-4 mb-1">
            Detalles de la transacción
          </div>
  
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-medium text-stone-800 text-sm">
                      {item.name}
                    </span>
                    <span className="text-xs text-stone-500">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </span>
                  </div>
  
                  <div className="font-semibold text-stone-800">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
  
              <div className="border-t pt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Items</span>
                  <span>{items.length}</span>
                </div>
  
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
  
        {/* RIGHT SIDE */}
        <div className="flex flex-col bg-white border rounded-md p-4">
          <div className="text-xs font-semibold text-stone-500 mb-1">
            Selecciona método de pago
          </div>
  
          <Select
            value={method}
            onValueChange={(v: PaymentMethod) => setMethod(v)}
          >
            <SelectTrigger className="bg-stone-50 border-stone-300">
              <SelectValue placeholder="Método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="efectivo">Efectivo</SelectItem>
              <SelectItem value="tarjeta">Tarjeta</SelectItem>
            </SelectContent>
          </Select>
  
          <div className="mt-6">
            <div className="text-xs font-semibold text-stone-500 mb-1">
              Monto recibido
            </div>
            <Input
              className="text-3xl h-16 font-semibold bg-stone-50 border-stone-300"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
  
            <div className="flex gap-2 mt-3">
              {quickAmounts.map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-stone-50 border-stone-300"
                  onClick={() => setAmount(v.toFixed(2))}
                >
                  ${v}
                </Button>
              ))}
            </div>
          </div>
  
          <div className="mt-6 mb-3">
            <div className="text-xs font-semibold text-stone-500 mb-1 ">
              Referencia (opcional)
            </div>
            <Input
              placeholder={
                method === "tarjeta"
                  ? "Últimos 4 dígitos / voucher"
                  : "Notas del pago"
              }
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
  
          <Button
            className="w-full mt-auto h-12 bg-amber-400 hover:bg-amber-500 text-stone-900 font-semibold"
            disabled={isSubmitting}
            onClick={() =>
              onConfirm({
                method,
                amount: parseFloat(amount),
                reference: reference.trim(),
              })
            }
          >
            Registrar pago
          </Button>
        </div>
  
      </div>
    </DialogContent>
  </Dialog>
  
    // <Dialog open={open} onOpenChange={onOpenChange}>
    //   <DialogContent
    //     className="
    //       w-full
    //       !max-w-[1050px]
    //       p-0
    //       overflow-hidden
    //       rounded-2xl
    //     "
    //   >
    //     {/* GRID PRINCIPAL: 2 columnas en md+ */}
    //     <div className="grid grid-cols-1 md:grid-cols-[2.2fr,1.3fr] min-h-[480px]">
    //       {/* COLUMNA IZQUIERDA: Detalles */}
    //       <div className="flex flex-col bg-stone-50 border-r">
    //         <DialogHeader className="px-6 pt-6 pb-3">
    //           <DialogTitle className="text-lg font-semibold">Pago</DialogTitle>
    //           <DialogDescription className="text-xs text-stone-500">
    //             Revisa los productos y registra el pago.
    //           </DialogDescription>
    //         </DialogHeader>

    //         <div className="px-6 text-xs font-semibold text-stone-500 mb-1">
    //           Detalles de la transacción
    //         </div>

    //         <ScrollArea className="flex-1 px-6 pb-4">
    //           <div className="space-y-4">
    //             {items.map((item, idx) => (
    //               <div
    //                 key={idx}
    //                 className="flex justify-between items-start text-sm"
    //               >
    //                 <div className="flex flex-col">
    //                   <span className="font-medium text-stone-800">
    //                     {item.name}
    //                   </span>
    //                   <span className="text-xs text-stone-500">
    //                     {item.quantity} x ${item.price.toFixed(2)}
    //                   </span>
    //                 </div>
    //                 <span className="font-semibold text-stone-800">
    //                   ${(item.quantity * item.price).toFixed(2)}
    //                 </span>
    //               </div>
    //             ))}

    //             <div className="border-t pt-4 mt-2 space-y-1 text-sm">
    //               <div className="flex justify-between">
    //                 <span className="text-stone-500">Items</span>
    //                 <span>{items.length}</span>
    //               </div>
    //               <div className="flex justify-between font-semibold text-base mt-1">
    //                 <span>Total</span>
    //                 <span>${total.toFixed(2)}</span>
    //               </div>
    //             </div>
    //           </div>
    //         </ScrollArea>
    //       </div>

    //       {/* COLUMNA DERECHA: Método de pago + monto */}
    //       <div className="flex flex-col bg-white px-6 pt-6 pb-6">
    //         <div>
    //           <div className="text-xs font-semibold text-stone-500 mb-1">
    //             Selecciona método de pago
    //           </div>
    //           <Select
    //             value={method}
    //             onValueChange={(val: PaymentMethod) => setMethod(val)}
    //           >
    //             <SelectTrigger className="bg-stone-50 border-stone-300">
    //               <SelectValue placeholder="Método de pago" />
    //             </SelectTrigger>
    //             <SelectContent className="bg-white">
    //               <SelectItem value="ejectivo">Efectivo</SelectItem>
    //               <SelectItem value="tarjeta">Tarjeta</SelectItem>
    //             </SelectContent>
    //           </Select>
    //         </div>

    //         <div className="mt-6">
    //           <div className="text-xs font-semibold text-stone-500 mb-1">
    //             Monto recibido
    //           </div>
    //           <Input
    //             className="text-3xl h-16 font-semibold bg-stone-50 border-stone-300"
    //             value={amount}
    //             onChange={(e) => setAmount(e.target.value)}
    //           />
    //           <div className="flex gap-2 mt-3">
    //             {quickAmounts.map((v) => (
    //               <Button
    //                 key={v}
    //                 size="sm"
    //                 variant="outline"
    //                 className="flex-1 bg-stone-50 border-stone-300 text-xs"
    //                 type="button"
    //                 onClick={() => setAmount(v.toFixed(2))}
    //               >
    //                 ${v}
    //               </Button>
    //             ))}
    //           </div>
    //         </div>

    //         <div className="mt-6">
    //           <div className="text-xs font-semibold text-stone-500 mb-1">
    //             Referencia (opcional)
    //           </div>
    //           <Input
    //             placeholder={
    //               method === "tarjeta"
    //                 ? "Últimos 4 dígitos / voucher"
    //                 : "Notas del pago"
    //             }
    //             value={reference}
    //             onChange={(e) => setReference(e.target.value)}
    //           />
    //         </div>

    //         <div className="mt-auto pt-6">
    //           <Button
    //             className={cn(
    //               "w-full h-12 bg-amber-400 hover:bg-amber-500 text-stone-900 font-semibold",
    //               isSubmitting && "opacity-80 cursor-wait"
    //             )}
    //             disabled={isSubmitting}
    //             type="button"
    //             onClick={handleConfirm}
    //           >
    //             Registrar pago
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   </DialogContent>
    // </Dialog>
  );
};

export default PaymentDialog;

