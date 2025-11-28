import type { CashSession } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetCurrentCashSession = (date?: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const fetchSession = async (): Promise<CashSession | null> => {
    const accessToken = await getAccessTokenSilently();
    const params = date ? `?date=${date}` : "";
    const res = await fetch(`${API_BASE_URL}/api/my/cash-session/current${params}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) throw new Error("Error obteniendo caja");

    return res.json();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cashSession", date],
    queryFn: fetchSession,
  });

  return { cashSession: data ?? null, isLoading, isError };
};

export const useOpenCashSession = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const mutateFn = async (args: { openingAmount: number; date?: string }) => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE_URL}/api/my/cash-session/open`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error("Error abriendo caja");
    return res.json();
  };

  const { mutateAsync: openCash, isPending: isLoading } = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashSession"] });
    },
  });

  return { openCash, isLoading };
};

export const useCloseCashSession = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const mutateFn = async (args: { realClosingAmount: number; note?: string; date?: string }) => {
    const accessToken = await getAccessTokenSilently();
    const res = await fetch(`${API_BASE_URL}/api/my/cash-session/close`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });

    if (!res.ok) throw new Error("Error cerrando caja");

    const data = await res.json()
    return data;
  };

  const { mutateAsync: closeCash, isPending: isLoading } = useMutation({
    mutationFn: mutateFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashSession"] });
      // también podrías invalidar ["sales"], ["payments"], etc.
    },
  });

  return { closeCash, isLoading };
};
