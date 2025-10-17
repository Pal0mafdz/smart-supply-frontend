import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

type Props = {
    onSearch: (value: string)=> void;
    placeholder?: string;
};

const SearchBar = ({onSearch, placeholder = "Buscar receta...."}: Props) => {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onSearch(newValue);
    }
  return (
    <div className="relative w-full sm:w-[24rem] md:w-[30rem] lg:w-[36rem] ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400  " size={18}/>
        <Input type="text" value={value} onChange={handleChange} placeholder={placeholder} className="pl-10 pr-4 py-2 rounded-xl bg-white shadow-sm border-b border-zinc-200 focus:ring-2 focus:ring-primary"/>
    </div>
  )
}

export default SearchBar