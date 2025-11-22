import type { Table } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type TableOverTwoHours = {
  id: string;
  number: number;
  area: "Terraza" | "Area Principal";
  customers: number;
  waiterName?: string;
  openedAt?: string | Date;
  minutesOpen: number | null;
};

export const useSetTableAvailable = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const setAvailableRequest = async ({ id }: { id: string }) => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/my/table/${id}/available`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: "disponible" }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "No se pudo marcar la mesa como disponible");
    }

    return response.json();
  };

  const {
    mutateAsync: setTableAvailable,
    isPending: isLoading,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: setAvailableRequest,
    onSuccess: () => {
      // refresca las mesas en pantalla
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });

  return {
    setTableAvailable,
    isLoading,
    isError,
    isSuccess,
  };
};

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

export const useGetTablesOverTwoHours = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } =
    useAuth0();

  const fetchTablesOverTwoHours = async (): Promise<TableOverTwoHours[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/table/over-two-hours`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener mesas abiertas > 2 horas");
    }

    return response.json();
  };

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tablesOverTwoHours"],
    queryFn: fetchTablesOverTwoHours,
    enabled: isAuthenticated && !authLoading, 
    refetchInterval: 60_000, 
  });

  return {
    tablesOverTwoHours: data ?? [],
    isLoading: isLoading || authLoading,
    isError,
  };
};


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

  