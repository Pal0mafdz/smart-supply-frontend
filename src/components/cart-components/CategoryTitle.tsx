import { CardTitle } from "../ui/card";


type Props = {
    title: string;
    items: number;
    Icon: any;
    className?: string;
    onClick(): void;
    active?: boolean;
}

const CategoryTitle = ({title, items, Icon, className, onClick, active}: Props) => {
  return (
    <div
    onClick={onClick}
    className={[
      "rounded-xl p-4 border border-stone-200 cursor-pointer select-none transition-all duration-300",
      "hover:scale-105 hover:shadow-lg hover:-translate-y-1",
      active
        ? "bg-stone-900 text-white shadow-lg scale-105"
        : "bg-green text-stone-900",
      className ?? "",
    ].join(" ")}
  >
    <div className="flex items-center justify-between">
      <Icon className={`h-5 w-5 opacity-80 ${active ? "text-white" : "text-white"}`} />
    </div>
    <CardTitle className="mt-6 text-lg">{title}</CardTitle>
    <p className="text-xs opacity-80">{items} items</p>
  </div>
  //   <div onClick={onClick}
  //   className={[
  //     "rounded-xl p-4 border border-stone-200 cursor-pointer",
  //     "shadow-sm",
  //     className ?? "bg-stone-100 text-stone-900",
  //   ].join(" ")}
  // >
  //   <div className="flex items-center justify-between">
  //     <Icon className="h-5 w-5 opacity-70 text-white" />
  //   </div>
  //   <CardTitle className="mt-6 text-lg">{title}</CardTitle>
  //   <p className="text-xs opacity-70">{items} items</p>
  // </div>
  )
}

export default CategoryTitle