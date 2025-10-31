import type { Dish} from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type AddDishParams = {
  orderId: string;
  // tableId: string;
  recipeId: string;
  quantity?: number;
  note?: string;
};

type UpdateDishParams = {
  orderId: string;
  dishId: string;
  quantity?: number;
  note?: string;
};

export const useGetDishes = (orderId: string)=> {
  const {getAccessTokenSilently} = useAuth0();
  // const queryClient = useQueryClient();

  const getDishesRequest = async(): Promise<Dish[]> => {
    
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/table/order/${orderId}/dishes`, {


      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    })
    if(!response.ok){
      throw new Error("Failed to fetch dishes");
    }
    const data = await response.json()
    return data.dishes;
    // return response.json();
  }

  const {data: dishes, isLoading} = useQuery({queryKey: ["dishes", orderId], queryFn: getDishesRequest});

  return {dishes, isLoading};
}


export const useAddDish = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const addDishRequest = async ({
    orderId,
    // tableId,
    recipeId,
    quantity = 1,
    note = "",
  }: AddDishParams): Promise<AddDishParams> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/table/order/${orderId}/dishes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ tableId, recipeId, quantity, note }),
        body: JSON.stringify({ recipeId, quantity, note }),
      }
    );

    if (!response.ok) throw new Error("Failed to add dish");
    return response.json();
  };

  const { mutateAsync: addDish, isPending, isError, isSuccess } = useMutation({
    mutationFn: addDishRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dishes", data.orderId] });
    },
  });

  return { addDish, isLoading: isPending, isError, isSuccess };
};



export const useRemoveDish = (orderId: string)=> {
  const {getAccessTokenSilently} = useAuth0();
   const queryClient = useQueryClient();

  const removeDishRequest = async(): Promise<Dish> => {
    
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/table/order/${orderId}/dishes`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    })
    if(!response.ok){
      throw new Error("Failed to remove dish");
    }
    return response.json();
  }
  const {
    mutateAsync: removeDish,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: removeDishRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast.success("Plato eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el plato");
    },
  });

  return { removeDish, isLoading: isPending, isError, isSuccess };
 
}


export const useUpdateDish = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const updateDishRequest = async ({
    orderId,
    dishId,
    quantity,
    note,
  }: UpdateDishParams): Promise<{ order: { dishes: Dish[] } }> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/api/my/table/order/${orderId}/dishes/${dishId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity, note }),
      }
    );

    if (!response.ok) throw new Error("Failed to update dish");
    return response.json();
  };

  const {
    mutateAsync: updateDish,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: updateDishRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast.success("Plato actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar el plato");
    },
  });

  return { updateDish, isLoading: isPending, isError, isSuccess };
};