import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddRecipe, useEditRecipe } from "@/api/MyRecipeApi";
import RecipeForm from "../forms/RecipeForm";
import type { Recipe } from "@/types";

import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

type Props = {
  recipe?: Recipe;
  open: boolean;
  onClose: () => void;
  title?: string;
  
}

const DialogRecipe = ({recipe, open, onClose, title}: Props) => {
  const { addRecipe, isLoading: isAdding } = useAddRecipe();
  const {editRecipe, isLoading: isEditing} = useEditRecipe();


 

  const handleSave = async (formData: FormData) => {
      
    if (recipe?._id) {
      await editRecipe({ id: recipe._id, recipedata: formData });
    } else {
      console.log("Receta", formData);

      await addRecipe(formData);
    }
   
    onClose();
    
  };

  const isEditingMode = !!recipe;
  const dialogTitle = title || (isEditingMode ? "Editar" : "Agregar nueva receta");

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if(isDesktop){

  return (
    <Dialog open={open} onOpenChange={(isOpen)=>!isOpen && onClose() }>
   
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>Llena el formulario para guardar los datos de la receta.</DialogDescription>

        </DialogHeader>
        

        <div>
          <RecipeForm
            onSave={handleSave}
            isLoading={isAdding || isEditing}
            recipeData={recipe}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};


return(
  <Drawer open={open} onOpenChange={(isOpen: any)=>!isOpen && onClose() }>
          <DrawerContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DrawerHeader>
          <DrawerTitle>{dialogTitle}</DrawerTitle>
          <DrawerDescription>Llena el formulario para guardar los datos de la receta.</DrawerDescription>

        </DrawerHeader>
        

        <div>
          <RecipeForm
            onSave={handleSave}
            isLoading={isAdding || isEditing}
            recipeData={recipe}
          />
        </div>
      </DrawerContent>

  </Drawer>
)
}

export default DialogRecipe;


