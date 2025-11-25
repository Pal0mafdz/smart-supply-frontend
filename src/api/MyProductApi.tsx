import type { Movement, Product, Shrinkage } from "@/types";
import { useAuth0 } from "@auth0/auth0-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type AddProduct = {
   
    product: Product,
    movement: Movement,
}

type EditProductMovementArgs = {
  productId: string;
  updates: {
    type: "entrada" | "salida" | "merma";
    quantity: number;
    note?: string;
  }
}

// === AI RECOMMENDATIONS ===

export interface AISupplierRecommendation {
  supplierName: string;
  website?: string;
  notes?: string;
  relativePriceComment?: string;
}

export interface LowStockSupplierResponse {
  count: number;
  items: {
    productId: string;
    productName: string;
    quantityInStock: number;
    minStock: number;
    currentSupplier: string | null;
    recommendations: AISupplierRecommendation[];
  }[];
}

export const useGetLowStockSupplierRecommendations = () => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchAiRecommendations = async (): Promise<LowStockSupplierResponse> => {
    const accessToken = await getAccessTokenSilently();

    const res = await fetch(
      `${API_BASE_URL}/api/my/product/ai/low-stock-suppliers`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("No se pudieron obtener recomendaciones de proveedores IA");
    }

    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["aiRecommendationsLowStock"],
    queryFn: fetchAiRecommendations,
  });

  return {
    data,
    isLoading,
    error,
  };
};


export const useGetShrinkages = () => {
  const {getAccessTokenSilently} = useAuth0();
  const getShrinkagesRequest = async(): Promise<Shrinkage[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/my/product/shrinkages`, {
        method: "GET",
        headers:{
            Authorization: `Bearer ${accessToken}`
        }
    })
    if(!response.ok){
        throw new Error("Failed to fetch shrinkages");
    }
    return response.json();
}
const {data: shrinkages, isLoading} = useQuery({queryKey: ["fetchShrinkages"], queryFn: getShrinkagesRequest});

return {shrinkages, isLoading};
}

export const useEditProduct = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const editProductRequest = async ({
    productId,
    updates,
  }: EditProductMovementArgs) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/my/product/${productId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Error al registrar movimiento");
    }

    return (await response.json()) as {
      product: Product;
      movement: any;
    };
  };

  const {
    mutateAsync: editProduct,
    isPending: isLoading,
  } = useMutation({
    mutationFn: editProductRequest,
    onSuccess: () => {
      toast.success("Movimiento registrado correctamente");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error al registrar movimiento");
    },
  });

  return { editProduct, isLoading };
};





export const useExportProductsToExcel = () => {
    const { getAccessTokenSilently } = useAuth0();
  
    const exportProductsRequest = async () => {
      const accessToken = await getAccessTokenSilently();
  
      const response = await fetch(`${API_BASE_URL}/api/my/product/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al exportar productos a Excel");
      }
  
      // Recibimos el blob (archivo Excel)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Crear un link temporal para forzar la descarga
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "productos.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    };
  
    const { mutateAsync: exportProducts, isPending: isLoading } = useMutation({
      mutationFn: exportProductsRequest,
      onSuccess: () => {
        toast.success("Archivo Excel generado correctamente 📦");
      },
      onError: (err: Error) => {
        toast.error(err.message || "No se pudo exportar el archivo Excel");
      },
    });
  
    return {
      exportProducts,
      isLoading,
    };
  };


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
  