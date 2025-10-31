import type { Table } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetTables = ()=> {
    const {getAccessTokenSilently} = useAuth0();

    const getTablesRequest = async(): Promise<Table[]> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/table`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },

        });
        if (!response.ok) {
            throw new Error("Failed to get tables");
          }
      
          return response.json();
        };
        const {data: tables, isLoading} = useQuery({queryKey: ["tables"], queryFn: getTablesRequest,});

        return {tables, isLoading};

}


export const useOpenTable = () => {
    const { getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();
  
    const openTableRequest = async ({id, customers}:{id: string, customers: number}): Promise<Table> => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/my/table/${id}/open`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customers }),

     
      });
  
      if (!response.ok) {
        throw new Error("Failed to open table");
      }
  
      return response.json();
    };
    const { mutateAsync: openTable, isPending: isLoading, isError, isSuccess } = useMutation({
        mutationFn: openTableRequest,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tables"] })
        },
      })
    return {
      openTable,
      isLoading,
      isError,
      isSuccess,
    };
  };

  