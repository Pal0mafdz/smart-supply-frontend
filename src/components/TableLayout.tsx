import type { Table } from "@/types";
import { Armchair, Users } from "lucide-react";
import { Badge } from "./ui/badge";

const STATUS_STYLES: Record<Table["state"], {card: string, chair: string, dot: string; text: string; }> = {
    disponible: {

        card: "bg-teal ",
        chair: "text-dark-teal",
        dot: "bg-slate-600",
        text: "text-slate-700",
        
    },
    abierta: {
        card: "bg-amber ",
        chair: "text-yellow-600",
        dot: "bg-slate-600",
        text: "text-slate-700",
        
    },
    reservada: {
        card: "bg-rose-100 border-rose-300",
        chair: "bg-rose-600",
        dot: "bg-rose-500",
        text: "text-rose-900",
        // label: "Reservada",

    },
    cerrada: {
        card: "bg-orange ",
        chair: "text-dark-orange",
        dot: "bg-slate-600",
        text: "text-slate-700",
        
    }
}

function ChairsRow({count, className, chairClass, rotate}: {count: number; className: string; chairClass: string; rotate?: string}){
    return(
        <div className={`absolute w-full flex items-center justify-around ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
            <Armchair key={i} className={`h-8 w-8 fill-current ${chairClass} ${rotate ?? ""}`}/>
         
          
        ))}
      </div>
    )
}

function SideChairs({count, side, chairClass}: {count: number; side: "left" | "right"; chairClass: string; }){
    const rotation = side === "left" ? "-rotate-90" : "rotate-90";
    const offset = side === "left" ? "-left-8" : "-right-8";
    
    return (
        <div
      className={`absolute top-0 h-full flex flex-col items-center justify-around ${offset}`}
    >
      {Array.from({ length: count }).map((_, i) => (

        <Armchair key={i} className={`h-8 w-8 fill-current ${chairClass} ${rotation}`} />
      ))}
    </div>
      );
}

type Props = {
  table: Table;
  onClick: () => void;
}

// {recipe, open, onClose, title}: Props


// const TableLayout = ({table}: {table: Table}) => {
const TableLayout = ({table, onClick}: Props) => {
    const style = STATUS_STYLES[table.state];
    const seats = table.capacity;

    let topCount = 0;
    let bottomCount = 0;
    let sideCount = 0;

    if (seats <= 2) {

        topCount = bottomCount = 1;
      } else if (seats <= 4) {

        topCount = bottomCount = 1;
        sideCount = 1;
      } else if (seats <= 6) {

        topCount = bottomCount = 3;
      } else {

        topCount = bottomCount = Math.ceil(seats / 4);
        sideCount = Math.max(1, Math.floor((seats - topCount * 2) / 2));
      }

      const rectSize =
      seats >= 6
        ? "w-72 h-28"
        : seats >= 4
        ? "w-60 h-24"
        : "w-39 h-20";


  return (
    <div onClick={onClick} className="relative flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
       {topCount > 0 && (
        <ChairsRow
          count={topCount}
          className="-top-9" 
          chairClass={style.chair}
          
        />
      )}

      {bottomCount > 0 && (
        <ChairsRow
          count={bottomCount}
          className="-bottom-9"
          chairClass={style.chair}
          rotate="rotate-180"
        />
      )}


      {sideCount > 0 && (
        <>
          <SideChairs count={sideCount} side="left" chairClass={style.chair} />
          <SideChairs count={sideCount} side="right" chairClass={style.chair} />
        </>
      )}

      <div
        className={`relative ${rectSize} rounded-xl ${style.card} ${style.text} grid place-items-center text-center`}
      >
        <div className="space-y-1">
          <p className="text-bold">Mesa {table.number}</p>

          <p className="flex items-center justify-center gap-1 text-xs opacity-80">
            <Users className="h-4 w-4" />
            <span>{table.customers}</span>
          </p>

          <div className="mt-1">
            {/* <Badge
              variant="secondary"
              className={`border ${style.card.split(" ").find((c) =>
                c.startsWith("border-")
              )}`}
            >
              {style.label}
            </Badge> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TableLayout