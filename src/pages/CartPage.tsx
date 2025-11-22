
import DishCard from "@/components/cart-components/DishCard";
import CategoryTitle from "@/components/cart-components/CategoryTitle";
import { useGetRecipes } from "@/api/MyRecipeApi";
import { Separator } from "@/components/ui/separator";
import { Coffee, Soup, UtensilsCrossed, Cake } from "lucide-react";
import Spinner from "@/components/Spinner";
import type { Recipe } from "@/types";
import CartLayout from "@/components/CartLayout";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AlertNotFound from "@/components/cart-components/AlertNotFound";

const CartPage = () => {
  const { recipes, isLoading } = useGetRecipes();
  const [selectedType, setSelectedType] = useState<Recipe["typeOR"]>("Desayunos");
  const [searchParams] = useSearchParams();
  // const {tableId} = useParams();
  // const [setShowAlert, showAlert] = useState(false);


  const tableNumber = searchParams.get("tableNumber") ? Number(searchParams.get("tableNumber")) : undefined;
  const customers = searchParams.get("customers") ? Number(searchParams.get("customers")) : undefined;
  const orderId = searchParams.get("orderId") ?? "";
  
  

  if (isLoading) return <Spinner />;

  const byType = (type: Recipe["typeOR"]) =>
    recipes?.filter((r) => r.typeOR === type)?? [];

  const filteredRecipes =
    !selectedType 
      ? []
      : recipes?.filter((r) => r.typeOR === selectedType) ?? [];

  return (
    <><AlertNotFound tableNumber={tableNumber} customers={customers}/>
    <CartLayout tableNumber={tableNumber} customers={customers} orderId={orderId!}>
      <div className="space-y-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          <CategoryTitle
            onClick={() => setSelectedType("Desayunos")}
            title="Desayunos"
            items={byType("Desayunos").length}
            Icon={Coffee}
            active={selectedType === "Desayunos"} />
          <CategoryTitle
            onClick={() => setSelectedType("Entradas")}
            title="Entradas"
            items={byType("Entradas").length}
            Icon={Soup}
            active={selectedType === "Entradas"} />
          <CategoryTitle
            onClick={() => setSelectedType("Platos Fuertes")}
            title="Platos Fuertes"
            items={byType("Platos Fuertes").length}
            Icon={UtensilsCrossed}
            active={selectedType === "Platos Fuertes"} />
          <CategoryTitle
            onClick={() => setSelectedType("Postres")}
            title="Postres"
            items={byType("Postres").length}
            Icon={Cake}
            active={selectedType === "Postres"} />
        </div>

        {selectedType && (
          <>
            <Separator className="my-4 bg-stone-800" />

            <div className="text-right font-semibold text-sm text-gray-600">
              {filteredRecipes.length} resultado
              {filteredRecipes.length !== 1 && "s"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRecipes.map((r) => (
                <DishCard key={r._id ?? r.recipename} recipe={r} qty={0} orderId={orderId}/>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-gray-500 text-center mt-10">
                No hay recetas en esta categoría.
              </div>
            )}
          </>
        )}


      </div>
    </CartLayout></>
  );
};

export default CartPage;
