import type { CategoryProd } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetCategoriesProd = () =>{
    const {getAccessTokenSilently} = useAuth0();
    const getCategoriesProdRequest = async(): Promise<CategoryProd[]> =>{
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/product/category`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
             
            }
        })

        if(!response.ok){
            throw new Error("Unable to fetch categories");
        }
        return response.json();
    }

    const {data: categories, isLoading} = useQuery({queryKey: ["categories"], queryFn: getCategoriesProdRequest, });

    return {categories, isLoading};

}

export const useAddCategoryProd = () =>{
    const {getAccessTokenSilently} = useAuth0();
    const queryClient = useQueryClient();
    const addCategoryProdRequest = async(category:{name: string}): Promise<CategoryProd> =>{
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/product/category`, {
            method: "POST",
            headers:{
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
        })

        if(!response.ok){
            throw new Error("Failed into adding category");
        }
        return response.json();
    }
    const { mutateAsync: addCategoryProd, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn:addCategoryProdRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"]});
            
          },
    });


    return {
        addCategoryProd,
        isLoading,
        isError,
        isSuccess,
    }

}

export const useDeleteCategoryProd = () =>{
    const {getAccessTokenSilently} = useAuth0();
    const queryClient = useQueryClient();
    const deleteCategoryProdRequest = async(id: string): Promise<CategoryProd> =>{
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/product/category/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                
            }
        })

        if(!response.ok){
            throw new Error("Unable to delete the category");
        }
        return response.json();
    }

    const { mutateAsync: deleteCategoryProd, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn:deleteCategoryProdRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"]});
            
          },
          
    });

    return {
        deleteCategoryProd,
        isLoading,
        isError,
        isSuccess,
    }

}

