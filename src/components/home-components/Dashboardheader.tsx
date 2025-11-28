import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

type Props = {
  today: Date
  selectedDate: Date
  onDateChange: (date: Date) => void
}

const DashboardHeader = ({ today, selectedDate, onDateChange }: Props) => {
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Título */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Resumen de venta 📈</h1>
        <p className="text-muted-foreground">
          {format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>


      <div className="flex items-center gap-3">
        {/* Badge dinámico (hoy o fecha distinta) */}
        <Badge variant="secondary" className="text-sm">
          {format(today, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
            ? "Hoy"
            : "Fecha seleccionada"}
        </Badge>

  
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP", { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              disabled={(date)=> date > today}
              onSelect={(date) => {
                if(!date) return
                if(date > today) return
                onDateChange(date)
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default DashboardHeader
