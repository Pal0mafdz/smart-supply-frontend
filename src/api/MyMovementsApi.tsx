import type { Movement } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useExportMovementsToExcel = () => {
    const { getAccessTokenSilently } = useAuth0();
  
    const exportMovementsRequest = async () => {
      const accessToken = await getAccessTokenSilently();
  
      const response = await fetch(`${API_BASE_URL}/api/my/movement/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al exportar movimientos a Excel");
      }
  

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "movimientos.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    };
  
    const { mutateAsync: exportMovements, isPending: isLoading } = useMutation({
      mutationFn: exportMovementsRequest,
      onSuccess: () => {
        toast.success("Archivo Excel de movimientos generado correctamente 📦");
      },
      onError: (err: Error) => {
        toast.error(err.message || "No se pudo exportar el archivo Excel");
      },
    });
  
    return {
      exportMovements,
      isLoading,
    };
  };


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