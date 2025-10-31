import type { Recipe } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAddRecipe = () => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();
  
    const addRecipeRequest = async (recipeData: FormData): Promise<Recipe> => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/my/recipe`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: recipeData, 
      });
  
      if (!response.ok) {
        throw new Error("Failed to add recipe");
      }
  
      return response.json();
    };
  
    const { mutateAsync: addRecipe, isPending: isLoading, isError, isSuccess } =
      useMutation({
        mutationFn: addRecipeRequest,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
      });
  
    return {
      addRecipe,
      isLoading,
      isError,
      isSuccess,
    };
  };

  export const useGetRecipes = () => {
    const {getAccessTokenSilently}= useAuth0();
    const getRecipesRequest = async(): Promise<Recipe[]> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/recipe`, {
            method: "GET",
            headers:{
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            

        })
        if(!response.ok){

            throw new Error("Failed to fetch recipes");
        }
        return response.json();

    }

    const {data: recipes, isLoading} = useQuery({queryKey: ["recipes"], queryFn: getRecipesRequest, staleTime: 5* 10 * 1000, gcTime: 10 * 60 *1000,});

    return {recipes, isLoading};
}

export const useEditRecipe = () => {
  const {getAccessTokenSilently}= useAuth0();
  const queryClient = useQueryClient();
  const editRecipeRequest = async({id, recipedata}: {id: string, recipedata: FormData}): Promise<Recipe> => {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`${API_BASE_URL}/api/my/recipe/${id}`, {
          method: "PUT",
          headers:{
              Authorization: `Bearer ${accessToken}`,
              
          },
          body: recipedata,
          

      })
      if(!response.ok){

          throw new Error("Failed to edit recipe");
      }
      return response.json();

  }

  const { mutateAsync: editRecipe, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn: editRecipeRequest,
    onSuccess: () => {
       queryClient.invalidateQueries({queryKey: ["recipes"]});
        toast.success("Se ha actualizado correctamente!");
      },
      onError: (err: Error) => {
        toast.error(err.message || "Error al actualizar el producto");
      },
});

  return {
    editRecipe,
    isLoading,
    isError,
    isSuccess,
    
  }

 
}

export const useDeleteRecipe = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const deleteRecipeRequest = async (id: string): Promise<Recipe> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/recipe/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      
    });

    if (!response.ok) {
      throw new Error("Failed to delete recipe");
    }

    return response.json();
  };

  const { mutateAsync: deleteRecipe, isPending: isLoading, isError, isSuccess } =
    useMutation({
      mutationFn: deleteRecipeRequest,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        toast.success("Se ha elminado la receta");
      },
      onError: () => {
        toast.error("Ha ocurrido un error al eliminar la receta");
      }
    });

  return {
    deleteRecipe,
    isLoading,
    isError,
    isSuccess,
  };
};
