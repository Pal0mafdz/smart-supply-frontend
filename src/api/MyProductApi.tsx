import type { Movement, Product } from "@/types";
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type AddProduct = {
   
    product: Product,
    movement: Movement,
}


export const useGetProducts = () => {
    const {getAccessTokenSilently}= useAuth0();
    const getProductsRequest = async(): Promise<Product[]> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/product`, {
            method: "GET",
            headers:{
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            

        })
        if(!response.ok){

            throw new Error("Failed to fetch products");
        }
        return response.json();

    }

    const {data: products, isLoading} = useQuery({queryKey: ["products"], queryFn: getProductsRequest});

    return {products, isLoading};

   
}



export const useAddProduct = () =>{
    const {getAccessTokenSilently} = useAuth0();
    const queryClient = useQueryClient();
    const addProductRequest = async(productFormData: FormData): Promise<AddProduct> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/product`, {
            method: "POST",
            headers:{
                Authorization: `Bearer ${accessToken}`,
                
            },
            body: productFormData,
        })
        if(!response.ok){
            throw new Error("Failed to upload product");
        }
        return response.json();
    }

    const { mutateAsync: addProduct, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn:addProductRequest,
        onSuccess: () => {
            toast.success("La entrada ha sido exitosa!!");
            queryClient.invalidateQueries({ queryKey: ["products"] });
          },
          onError: (err: Error) => {
            toast.error(err.message || "Error al realizar la entrada del producto");
          },
    });

    return {
        addProduct,
        isLoading,
        isError,
        isSuccess,
    };
}

export const useGetProductById = (productId?: string)=>{
    const {getAccessTokenSilently}= useAuth0();
    const getProductRequest = async(): Promise<Product> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/product/${productId}`, {
            method: "GET",
            headers:{
                Authorization: `Bearer ${accessToken}`,
                
            },
            

        })
        if(!response.ok){

            throw new Error("Failed to fetch product");
        }
        return response.json();

    }

    const { mutate: fetchProduct, data: product, isPending: isLoading, error } = useMutation({
        mutationFn: getProductRequest,
      });
    
      return {
        fetchProduct, 
        product,
        isLoading,
        error,
      };
}


export const useEditProduct = () => {
    const {getAccessTokenSilently} = useAuth0();
    const queryClient = useQueryClient();
    const editProductRequest = async({productId, updates}: {productId: string, updates: {quantityInStock: number, note: string}}): Promise<Product> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/product/${productId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify(updates),
        })

        if(!response.ok){
            throw new Error("Failed to update product");
        }
        return response.json();

    }

    const { mutateAsync: editProduct, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn: editProductRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["products"]});
            toast.success("Se ha actualizado correctamente!");
          },
          onError: (err: Error) => {
            toast.error(err.message || "Error al actualizar el producto");
          },
    });

    return {
        editProduct,
        isLoading,
        isError,
        isSuccess,
    }
}



export const useDeleteProduct = () => {
    const {getAccessTokenSilently} = useAuth0();
    const deleteProdutctRequest = async(productId: string) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/product/${productId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
           
            }

        })

        if(!response.ok){
            throw new Error("Failed to delete product");

        }
        return response.json();
        
    }

    const { mutateAsync: deleteProduct, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn: deleteProdutctRequest,
        onSuccess: () => {
            toast.success("La salida del producto ha sido exitosa");
            
          },
          onError: (err: Error) => {
            toast.error(err.message || "No se ha podido realizar la salida del producto");
          },
    });

    return {
        deleteProduct,
        isLoading,
        isError,
        isSuccess,
    }

}

export const getMovements = () =>{
    const {getAccessTokenSilently} = useAuth0();
    const getMovementsRequest = async(): Promise<Movement[]> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/movement`, {
            method: "GET",
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        })
        if(!response.ok){
            throw new Error("Failed to fetch movements");
        }
        return response.json();
    }
    const {data: movements, isLoading} = useQuery({queryKey: ["fetchMovements"], queryFn: getMovementsRequest});

    return {movements, isLoading};
   
}

//----------------------------------------------------------------

export const useAddMovement = () => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();
  
    const addMovementRequest = async (movementData: {
      productId: string;
      type: "entrada" | "salida" | "ajuste";
      quantity: number;
      note: string;
    }) => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/my/movement`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movementData),
      });
  
      if (!response.ok) throw new Error("Error al registrar movimiento");
      return response.json();
    };
  
    const { mutateAsync: addMovement, isPending: isLoading } = useMutation({
      mutationFn: addMovementRequest,
      onSuccess: () => {
        toast.success("Movimiento registrado correctamente");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });
  
    return { addMovement, isLoading };
  };
  