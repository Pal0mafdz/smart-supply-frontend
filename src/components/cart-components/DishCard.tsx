import type { Recipe } from '@/types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { useAddDish } from '@/api/MyOrderApi';



type Props = {
  recipe: Recipe;
  qty?: number;

  orderId: string;
  // onAdd?: () => void;
  // onSub?: () => void;
};



// const DishCard = ({ recipe, qty = 0,  tableId, orderId }: Props) => {

const DishCard = ({ recipe, orderId }: Props) => {
  const {addDish} = useAddDish();

   

  const handleAddDish = async() =>{
    try {
      if (!orderId) {
        // toast.error("No se encontró la mesa.");
        return;
      }
      // await addDish({ tableId, orderId, recipeId: recipe._id!, quantity: 1, note:"" });
      await addDish({ orderId, recipeId: recipe._id!});
      // toast.success(`${recipe.recipename} agregado al carrito`);
    } catch (error) {
      console.log(error);
      // toast.error("Error al agregar platillo");
    }
  }

  return (

    <Card className="rounded-2xl overflow-hidden  shadow-md hover:shadow-lg transition-all" >
    <CardHeader className="flex justify-center p-3 ">
      <div className="rounded-2xl overflow-hidden w-full h-44 relative p-1 bg-white">
        <img
          src={recipe.imageUrl}
          alt={recipe.recipename}
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
    </CardHeader>

    <CardContent className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium leading-tight">
            {recipe.recipename}
          </p>
          <p className="text-xs text-stone-700">
            ${recipe.totalCost.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2">
{/*          
          <span className="w-5 text-center text-stone-900 text-sm">
            {qty}
          </span> */}

          <Button onClick={()=> handleAddDish()}>Agregar</Button>
        
        </div>
      </div>
    </CardContent>
  </Card>

  );
};

export default DishCard;
