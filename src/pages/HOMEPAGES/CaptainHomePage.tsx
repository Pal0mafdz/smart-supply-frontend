import { useGetTablesOverTwoHours } from '@/api/MyTableApi';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { toast } from 'sonner';

const CaptainHomePage = () => {
    const { tablesOverTwoHours, isLoading } = useGetTablesOverTwoHours();
    const alertedIdsRef = React.useRef<Set<string>>(new Set());

    React.useEffect(() => {
        const currentIds = new Set<string>();
    
        tablesOverTwoHours.forEach((t) => {
          const id = t.id ?? String(t.number);
          currentIds.add(id);
    
          if (!alertedIdsRef.current.has(id)) {
            const mins = t.minutesOpen ?? 120;
    
            toast.warning(`Mesa ${t.number} lleva ${mins} minutos abierta`, {
              description: `${t.area} · ${t.customers} comensales${
                t.waiterName ? ` · Mesero: ${t.waiterName}` : ""
              }`,
            });
          }
        });
    
        alertedIdsRef.current = currentIds;
      }, [tablesOverTwoHours]);
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Panel del capitán
          </h1>
          <p className="text-muted-foreground text-sm">
            Control de mesas y alertas de tiempo.
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Mesas abiertas &gt; 2 horas
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mesas con alerta</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Cargando mesas...</p>}

          {!isLoading && tablesOverTwoHours.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No hay mesas abiertas por más de 2 horas. 🟢
            </p>
          )}

          {!isLoading && tablesOverTwoHours.length > 0 && (
            <div className="space-y-2">
              {tablesOverTwoHours.map((t) => (
                <div
                  key={t.id ?? t.number}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <div>
                    <div className="font-semibold">
                      Mesa {t.number} · {t.area}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.customers} comensales{" "}
                      {t.waiterName && <>· Mesero: {t.waiterName}</>}
                    </div>
                  </div>
                  <Badge variant="destructive">
                    {t.minutesOpen ?? 120} min
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>

    
  )
}

export default CaptainHomePage