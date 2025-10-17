import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useState } from "react";

const RecipeMenu = () => {
  const [activeTab, setActiveTab] = useState("recetas");

  const tabs = [
    { id: "recetas", label: "Recetas" },
    { id: "entradas", label: "Entradas" },
    { id: "platos", label: "Platos fuertes" },
    { id: "postres", label: "Postres" },
  ];

  return (
    // <div className="w-full bg-white shadow-sm border-b border-zinc-200 rounded-3xl">
    <div className="w-full ">
      <div className="max-w-5xl mx-auto flex justify-center py-3">
        <Menubar className="border-none shadow-none bg-transparent space-x-6 rounded-3xl p-2">
          {tabs.map((tab) => (
            <MenubarMenu key={tab.id}>
              <MenubarTrigger
                onClick={() => setActiveTab(tab.id)}
                
                className={`px-4 py-2 rounded-2xl transition-all duration-200 select-none font-medium
                ${
                  activeTab === tab.id
                    ? "!bg-zinc-900 !text-white !shadow-sm scale-105"
                    : "text-zinc-700 hover:!bg-zinc-900 hover:!text-white"
                }
                focus-visible:ring-0 focus-visible:outline-none
                  data-[state=open]:bg-transparent data-[state=open]:text-zinc-700
                `}
              >
                {tab.label}
              </MenubarTrigger>
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
    </div>
  );
};

export default RecipeMenu;
