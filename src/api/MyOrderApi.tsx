import type { Dish, Order, Sale} from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type UpdateDishStatusParams = {
  orderId: string;
  dishId: string;
  status: "pendiente" | "en preparacion" | "listo para servir" | "entregado";
};


// type UpdateStatusParams = {
//   orderId: string;
//   status: "recibido" |"en preparacion" | "listo para servir" | "entregado" | "pagado";
// };

type AddDishParams = {
  orderId: string;
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



export const useGetOrders = () => {
  const { getAccessTokenSilently } = useAuth0();
    const getOrdersRequest = async (): Promise<Order[]> => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/my/table/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok){
        throw new Error("Failed to fetch orders");

      } 
      return response.json();
    };

    const { data: orders, isLoading, isError } = useQuery({
      queryKey: ["orders"],
      queryFn: getOrdersRequest,
    });

    return { orders, isLoading, isError };
};


export const useSendToKitchen = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

    const sendToKitchenRequest = async (orderId: string): Promise<Order> => {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(
        `${API_BASE_URL}/api/my/table/order/${orderId}/send-to-kitchen`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al mandar orden a cocina");
      }
      return response.json();
    };

    const { mutateAsync: sendToKitchen,isPending,isSuccess,isError,} = useMutation({mutationFn: sendToKitchenRequest,
      onSuccess: () => {
        toast.success("Orden enviada a cocina y venta registrada");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["sales"] }); 
        queryClient.invalidateQueries({ queryKey: ["dishes"] });

      },
      onError: () => {
        toast.error("Error al enviar la orden a cocina");
      },
    });

    return { sendToKitchen, isLoading: isPending, isSuccess, isError };
};

export const useUpdateDishStatus = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const updateDishStatusRequest = async ({
    orderId,
    dishId,
    status,
  }: UpdateDishStatusParams): Promise<Order> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/api/my/table/order/${orderId}/dishes/${dishId}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) throw new Error("Error al actualizar estado del platillo");
    return response.json();
  };

  const { mutateAsync: updateDishStatus, isPending, isError, isSuccess } =
    useMutation({
      mutationFn: updateDishStatusRequest,
      onSuccess: () => {
        toast.success("Estatus del platillo actualizado");
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["dishes"] });
      },
      onError: () => toast.error("Error al actualizar el estatus del platillo"),
    });

  return { updateDishStatus, isLoading: isPending, isError, isSuccess };
};


export const useGetSales = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getSalesRequest = async (): Promise<Sale[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/sales`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch sales");
    return response.json();
  };

  const { data: sales, isLoading, isError } = useQuery({
    queryKey: ["sales"],
    queryFn: getSalesRequest,
  });

  return { sales, isLoading, isError };
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
  }: AddDishParams): Promise<any> => {
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dishes", variables.orderId] });
      toast.success("Platillo agregado al carrito")
    },
    // onSuccess: (newDish, variables) => {
    //   // Actualiza instantáneamente la caché local
    //   queryClient.setQueryData(["dishes", variables.orderId], (old: Dish[] | undefined) => {
    //     const current = (old as Dish[] | undefined) ?? [];
    //     return [...current, newDish];
    //   });
    //   toast.success("Platillo agregado al carrito");
    // },
    onError: () => toast.error("Error al agregar el platillo"),
    
  });

  return { addDish, isLoading: isPending, isError, isSuccess };
};



export const useRemoveDish = (orderId: string)=> {
  const {getAccessTokenSilently} = useAuth0();
   const queryClient = useQueryClient();

  const removeDishRequest = async(dishId: string): Promise<Dish> => {
    
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/table/order/${orderId}/dishes/${dishId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["dishes", orderId] });
      toast.success("Plato eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el plato");
    },
    // onSuccess: (deletedDish, variables) => {
    //   // Actualiza la caché local instantáneamente
    //   queryClient.setQueryData<Dish[]>(["dishes", orderId], (old = []) =>
    //     old.filter((d) => d._id !== deletedDish._id)
    //   );
    //   toast.success("Platillo eliminado del carrito");
    // },
    // onError: () => toast.error("Error al eliminar el platillo"),
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
  // }: UpdateDishParams): Promise<{ order: { dishes: Dish[] } }> => {
  }: UpdateDishParams): Promise<any> => {
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dishes", variables.orderId] });
      toast.success("Orden actualizada");
    },
    onError: () => {
      toast.error("Error al actualizar la orden");
    },

  
  
  });

  return { updateDish, isLoading: isPending, isError, isSuccess };
};

export const useSendNewDishes = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const sendNewDishesRequest = async (orderId: string): Promise<Order> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/my/table/order/${orderId}/send-new-dishes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al enviar los nuevos platillos a cocina");
    }

    return response.json();
  };

  const { mutateAsync: sendNewDishes, isPending, isSuccess, isError } = useMutation({
    mutationFn: sendNewDishesRequest,
    onSuccess: () => {
      toast.success("Nuevos platillos enviados a cocina");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
    onError: () => {
      toast.error("Error al enviar los nuevos platillos");
    },
  });

  return { sendNewDishes, isLoading: isPending, isSuccess, isError };
};