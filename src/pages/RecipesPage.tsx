import { useGetRecipes } from '@/api/MyRecipeApi';
import DialogRecipe from '@/components/DialogRecipe';
import RecipeCard from '@/components/RecipeCard';
import RecipeMenu from '@/components/RecipeMenu';
import SearchBar from '@/components/SearchBar';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';

import { useState } from 'react';


const RecipesPage = () => {
  const {recipes, isLoading} = useGetRecipes();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("recetas")

 

  if (isLoading) {
    return <Spinner/>
  }


  const filteredRecipes = recipes?.filter((r) => {
    const matchesSearch = r.recipename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "recetas" ||
      r.typeOR.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });


  return (

   

    <div className="w-full px-8 pt-6 space-y-6">
  

      <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>

      <div className="flex items-center gap-4 w-full sm:w-auto">
    <h1 className="text-3xl font-bold">Recetario</h1>
    <SearchBar onSearch={setSearchTerm} />
  </div>


  <Button
    className="bg-stone-900 text-stone-300 rounded-2xl"
    onClick={() => setOpenDialog(true)}
  >
    + Agregar receta
  </Button>



        {/* <div className='flex items-center gap-4 w-full sm-w-auto'>

        <h1 className='text-3xl font-bold'>Recetario</h1>

        <SearchBar onSearch={setSearchTerm}/>
        <Button
            className="bg-stone-900 text-stone-300 rounded-2xl"
            onClick={() => setOpenDialog(true)}
          >
            + Agregar receta
          </Button> 

        </div> */}

      

    

      </div>
      <RecipeMenu onSelectCategory={setSelectedCategory}/>


      {filteredRecipes && filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                {filteredRecipes.map((receta) => (
                  <RecipeCard key={receta._id} recipe={receta} />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center mt-10">
                No hay recetas disponibles.
              </div>
            )}

      {openDialog && (
              <DialogRecipe
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                title="Agregar nueva receta"
              />
            )}

          </div>
          



   )
};

export default RecipesPage;