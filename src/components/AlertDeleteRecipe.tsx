import type { Recipe } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useState } from "react";
import { useDeleteRecipe } from "@/api/MyRecipeApi";
import { Button } from "@/components/ui/button";

type Props = {
    recipe: Recipe;
    open: boolean;
    onClose: () => void;
}
const AlertDeleteRecipe = ({recipe, open, onClose}: Props) => {
    const { deleteRecipe, isLoading } = useDeleteRecipe();
  // const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!recipe?._id) {
      console.error("No se encuentra el ID de la receta");
      return;
    }

    try {
      await deleteRecipe(recipe._id);
      onClose();
    } catch (error) {
      console.error("Error al eliminar la receta:", error);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
     
      {/* <AlertDialogTrigger asChild>
        <Button
          size="sm"
          className="px-3 py-1 bg-stone-900 text-stone-300 rounded-2xl hover:bg-red-600"
        >
          Eliminar
        </Button>
      </AlertDialogTrigger> */}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar receta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente la receta{" "}
            <span className="font-semibold">“{recipe.recipename}”</span>.  
            No podrás recuperarla después.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertDeleteRecipe