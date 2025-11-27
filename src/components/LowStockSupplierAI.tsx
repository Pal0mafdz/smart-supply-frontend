
// import { useGetLowStockSupplierRecommendations } from "@/api/MyProductApi";

// const LowStockSupplierAI = () => {
//   const { data, isLoading, error } = useGetLowStockSupplierRecommendations();

//   if (isLoading) return <p className="text-white">Cargando recomendaciones IA...</p>;
//   if (error) return <p className="text-red-500">Error al cargar recomendaciones.</p>;

//   return (
//     <div className="space-y-6 mt-4">
//       {data?.items.map((item) => (
//         <div
//           key={item.productId}
//           className="border border-gray-600 rounded-lg p-4 bg-gray-900 shadow-md"
//         >
//           <h2 className="text-xl font-bold text-white">
//             {item.productName}
//           </h2>

//           <p className="text-gray-300">
//             Stock actual:
//             <span className="ml-1 text-yellow-400">
//               {item.quantityInStock}/{item.minStock}
//             </span>
//           </p>

//           <p className="text-gray-400">
//             Proveedor actual:{" "}
//             <span className="text-blue-300">
//               {item.currentSupplier ?? "No definido"}
//             </span>
//           </p>

//           <h3 className="text-lg font-semibold mt-3 text-green-400">
//             🔮 Recomendaciones IA
//           </h3>

//           <ul className="space-y-2 mt-2">
//             {item.recommendations.map((rec, idx) => (
//               <li
//                 key={idx}
//                 className="p-3 rounded bg-gray-800 border border-gray-700"
//               >
//                 <p className="text-white font-semibold">{rec.supplierName}</p>

//                 {rec.website && (
//                   <a
//                     href={rec.website}
//                     target="_blank"
//                     className="text-blue-400 underline text-sm"
//                   >
//                     {rec.website}
//                   </a>
//                 )}

//                 {rec.relativePriceComment && (
//                   <p className="text-gray-400 text-sm">
//                     Precio:{" "}
//                     <span className="text-yellow-300">
//                       {rec.relativePriceComment}
//                     </span>
//                   </p>
//                 )}

//                 {rec.notes && (
//                   <p className="text-gray-400 text-sm mt-1">
//                     {rec.notes}
//                   </p>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LowStockSupplierAI;

import React from "react";
import { useGetLowStockSupplierRecommendations } from "@/api/MyProductApi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Sparkles, AlertTriangle, Factory, Globe2 } from "lucide-react";

/**
 * Pequeño componente para simular que la IA
 * va escribiendo el texto poco a poco.
 */
const TypingText: React.FC<{ text: string; speed?: number; className?: string }> = ({
  text,
  speed = 18,
  className,
}) => {
  const [displayed, setDisplayed] = React.useState("");

  React.useEffect(() => {
    setDisplayed("");
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={className}>{displayed}</span>;
};

const LowStockSupplierAI: React.FC = () => {
  const { data, isLoading, error } = useGetLowStockSupplierRecommendations();

  // 🎯 Estado: cargando → mostramos una tarjeta de “IA pensando”
  if (isLoading) {
    return (
      <Card className="mt-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black border-slate-700">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-full bg-slate-800/80">
            <Sparkles className="h-5 w-5 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-slate-50 text-base sm:text-lg">
              IA de proveedores analizando inventario...
            </CardTitle>
            <CardDescription className="text-slate-400">
              Buscando proveedores alternativos para tus productos con bajo stock.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/3 bg-slate-700/70" />
          <Skeleton className="h-4 w-full bg-slate-700/70" />
          <Skeleton className="h-4 w-5/6 bg-slate-700/70" />
          <Skeleton className="h-4 w-4/6 bg-slate-700/70" />
        </CardContent>
      </Card>
    );
  }

  // ❌ Estado: error
  if (error) {
    return (
      <Alert variant="destructive" className="mt-4 bg-red-950/60 border-red-700 text-red-100">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error al cargar recomendaciones</AlertTitle>
        <AlertDescription>
          Hubo un problema al consultar la IA de proveedores. Intenta de nuevo en unos segundos.
        </AlertDescription>
      </Alert>
    );
  }

  const items = data?.items ?? [];

  // ✅ Estado: sin productos con bajo stock
  if (items.length === 0) {
    return (
      <Card className="mt-4 bg-gradient-to-br from-emerald-950 via-slate-900 to-black border-emerald-700/70">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-full bg-emerald-900/80">
            <Sparkles className="h-5 w-5 text-emerald-200" />
          </div>
          <div>
            <CardTitle className="text-emerald-100 text-base sm:text-lg">
              No hay productos por debajo del mínimo
            </CardTitle>
            <CardDescription className="text-emerald-200/80">
              Tu inventario está sano. La IA no encontró productos que requieran acción inmediata.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  // 🧠 Estado: hay recomendaciones
  return (
    <Card className="mt-4 bg-gradient-to-br from-slate-950 via-slate-900 to-black border-slate-700">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 rounded-full bg-slate-800/80">
          <Sparkles className="h-5 w-5 text-emerald-300" />
        </div>
        <div>
          <CardTitle className="text-slate-50 text-base sm:text-lg">
            Recomendaciones IA de proveedores
          </CardTitle>
          <CardDescription className="text-slate-400">
            Basado en los productos con stock por debajo del mínimo y proveedores registrados.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="max-h-[420px] pr-3">
          <div className="space-y-4">
            {items.map((item) => (
              <Card
                key={item.productId}
                className="bg-slate-900/70 border-slate-700/70 shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-slate-50 text-sm sm:text-base">
                        {item.productName}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <span>
                          Stock actual:{" "}
                          <span className="text-amber-300 font-semibold">
                            {item.quantityInStock}/{item.minStock}
                          </span>
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="border-amber-400/80 text-amber-200 bg-amber-500/10 text-[0.7rem] sm:text-xs"
                    >
                      Bajo stock
                    </Badge>
                  </div>

                  <div className="mt-2 text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                    <Factory className="h-3.5 w-3.5" />
                    <span>
                      Proveedor actual:{" "}
                      <span className="text-sky-300 font-medium">
                        {item.currentSupplier ?? "No definido"}
                      </span>
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-xs sm:text-sm text-emerald-300 font-semibold mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Sugerencias de la IA
                  </p>

                  <div className="space-y-2">
                    {item.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-md bg-slate-950/70 border border-slate-700/80"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-50 text-sm font-semibold">
                              {rec.supplierName}
                            </span>
                            {rec.relativePriceComment && (
                              <Badge
                                variant="outline"
                                className="border-emerald-500/80 text-emerald-200 bg-emerald-500/10 text-[0.65rem]"
                              >
                                {rec.relativePriceComment}
                              </Badge>
                            )}
                          </div>

                          {rec.website && (
                            <a
                              href={rec.website}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[0.7rem] text-sky-300 hover:text-sky-200 underline-offset-2 hover:underline"
                            >
                              <Globe2 className="h-3 w-3" />
                              Sitio web
                            </a>
                          )}
                        </div>

                        {rec.notes && (
                          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            <TypingText text={rec.notes} />
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LowStockSupplierAI;
