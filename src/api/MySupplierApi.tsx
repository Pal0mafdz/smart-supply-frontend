import type {Supplier } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useEditSupplier = () => {
    const {getAccessTokenSilently} = useAuth0();
    const queryClient = useQueryClient();
    const editSupplierRequest = async({id, supplierdata}: {id: string, supplierdata: FormData}): Promise<Supplier> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/supplier/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: supplierdata,
        })
        if(!response.ok){
            throw new Error("Unable to edit supplier");
        }
        return response.json();
            
    }
    const { mutateAsync: editSupplier, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn: editSupplierRequest,
        onSuccess: () => {
           queryClient.invalidateQueries({queryKey: ["suppliers"]});
            toast.success("Se ha actualizado el proveedor correctamente!");
          },
          onError: (err: Error) => {
            toast.error(err.message || "Error al actualizar el proveedor");
          },
    });
    
      return {
        editSupplier,
        isLoading,
        isError,
        isSuccess,
        
      }
  
}


export const useGetSuppliers = () =>{
    const {getAccessTokenSilently} = useAuth0();
    const getSuppliersRequest = async(): Promise<Supplier[]> =>{
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/supplier/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
             
            }
        })

        if(!response.ok){
            throw new Error("Unable to fetch suppliers");
        }
        return response.json();
    }

    const {data: suppliers, isLoading} = useQuery({queryKey: ["suppliers"], queryFn: getSuppliersRequest, });

    return {suppliers, isLoading};

}

export const useGetSupplierById = (supplierId?: string) =>{
    const {getAccessTokenSilently} = useAuth0();
    const getSupplier = async(): Promise<Supplier> =>{
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/supplier/${supplierId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
             
            }
        })

        if(!response.ok){
            throw new Error("Unable to fetch suppliers");
        }
        return response.json();
    }

    const { mutate: fetchSupplier, data: supplier, isPending: isLoading, error } = useMutation({
        mutationFn: getSupplier,
      });
    return {
        fetchSupplier, 
        isLoading,
        supplier,
        error,
    };

}


export const useAddSupplier = () =>{
    const {getAccessTokenSilently} = useAuth0();
    const queryClient = useQueryClient();
    const addSupplierRequest = async(formData: FormData): Promise<Supplier> =>{
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/supplier`, {
            method: "POST",
            headers:{
                Authorization: `Bearer ${accessToken}`,
               
            },
            body: formData,
        })

        if(!response.ok){
            throw new Error("Failed into adding supplier");
        }
        return response.json();
    }
    const { mutateAsync: addSupplier, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn:addSupplierRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suppliers"]});
            
          },
    });


    return {
        addSupplier,
        isLoading,
        isError,
        isSuccess,
    }

}

// export const useDeleteSupplier = () =>{
//     const {getAccessTokenSilently} = useAuth0();
//     const queryClient = useQueryClient();
//     const deleteSupplierRequest = async(id: string): Promise<Supplier> =>{
//         const accessToken = await getAccessTokenSilently();
//         const response = await fetch(`${API_BASE_URL}/api/my/supplier/${id}`, {
//             method: "DELETE",
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
                
//             }
//         })

//         if(!response.ok){
//             throw new Error("Unable to delete the supplier");
//         }
//         return response.json();
//     }

//     const { mutateAsync: deleteSupplier, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn:deleteSupplierRequest,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["suppliers"]});
            
//           },
          
//     });

//     return {
//         deleteSupplier,
//         isLoading,
//         isError,
//         isSuccess,
//     }

// }