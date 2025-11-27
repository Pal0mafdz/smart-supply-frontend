import type { Payment, Sale } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type TopRecipe = {
    recipeId: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
  };

  export type RecipeSalesByPeriod = {
    date: string;
    recipeId: string;
    recipeName: string;
    totalSales: number;
    totalRevenue: number;
  };

  export type SalesByPeriod = {
    date: string;
    totalSales: number;
    totalRevenue: number;
  };

  export type PaymentMethod = "tarjeta" | "efectivo";


export type RegisterPaymentRequest = {
  orderId: string;
  cartItems: { productId: string; quantity: number }[];
  method: PaymentMethod;
  reference?: string;
};


export const useGetPayments = () => {
  const {getAccessTokenSilently}= useAuth0();
  const getPaymentsRequest = async(): Promise<Payment[]> => {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`${API_BASE_URL}/api/my/sale/payments`, {
          method: "GET",
          headers:{
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
          },
          

      })
      if(!response.ok){

          throw new Error("Failed to fetch payments");
      }
      return response.json();

  }

  const {data: payments, isLoading} = useQuery({queryKey: ["payments"], queryFn: getPaymentsRequest});

  return {payments, isLoading};

 
}


export const useRegisterPayment = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const registerPaymentRequest = async (
    data: RegisterPaymentRequest
  ): Promise<any> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/my/sale/register-payment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al registrar el pago");
    }

    return response.json();
  };

  const {
    mutateAsync: registerPayment,
    isPending: isLoading,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: registerPaymentRequest,
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["tables"]});
      queryClient.invalidateQueries({queryKey: ["orders"]});
     
    },
  });

  return {
    registerPayment,
    isLoading,
    isError,
    isSuccess,
  };
};

export const useGetSales = (startDate?: string, endDate?: string) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const getSalesRequest = async (): Promise<Sale[]> => {
    const accessToken = await getAccessTokenSilently();


    let url = `${API_BASE_URL}/api/my/sale`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener las ventas");
    }

    return response.json();
  };

  const { data: sales, isLoading, isError } = useQuery({
    queryKey: ["sales", startDate, endDate],
    queryFn: getSalesRequest,
    enabled: isAuthenticated,
  });

  return { sales, isLoading, isError };
};

export const useGetTopRecipes = (limit?: number, startDate?: string, endDate?: string) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
    const getTopRecipesRequest = async (): Promise<TopRecipe[]> => {
      const accessToken = await getAccessTokenSilently();
  
      const params = new URLSearchParams();
      if (limit) params.set("limit", String(limit));
      if (startDate && endDate) {
      params.set("startDate", startDate);
      params.set("endDate", endDate);
      }

    let url = `${API_BASE_URL}/api/my/sale/top-recipes`;
    const qs = params.toString();
    if (qs) url += `?${qs}`;

  
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener las recetas más vendidas");
      }
  
      return response.json();
    };
  
    const { data: topRecipes, isLoading, isError } = useQuery({
      queryKey: ["topRecipes", limit, startDate, endDate],
      queryFn: getTopRecipesRequest,
      enabled: isAuthenticated,
    });
  
    return { topRecipes, isLoading, isError };
  };

  
  export const useGetSalesByRecipeAndPeriod = (
    groupBy: "day" | "week" | "month" | "year" = "month",
    startDate?: string,
    endDate?: string
  ) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
    const getSalesRequest = async (): Promise<RecipeSalesByPeriod[]> => {
      const accessToken = await getAccessTokenSilently();
  
      let url = `${API_BASE_URL}/api/my/sale/by-recipe-and-period?groupBy=${groupBy}`;
      if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Error al obtener las ventas agrupadas");
  
      return response.json();
    };
  
    const { data, isLoading, isError } = useQuery({
      queryKey: ["salesByRecipeAndPeriod", groupBy, startDate, endDate],
      queryFn: getSalesRequest,
      enabled: isAuthenticated,
    });
  
    return { salesByRecipeAndPeriod: data, isLoading, isError };
  };



  
  export const useGetSalesByPeriod = (
    groupBy: "day" | "week" | "month" | "year" = "day",
    startDate?: string,
    endDate?: string
  ) => {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
    const getSalesByPeriodRequest = async (): Promise<SalesByPeriod[]> => {
      const accessToken = await getAccessTokenSilently();
  
      let url = `${API_BASE_URL}/api/my/sale/by-period?groupBy=${groupBy}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener las ventas por periodo");
      }
  
      return response.json();
    };
  
    const { data, isLoading, isError } = useQuery({
      queryKey: ["salesByPeriod", groupBy, startDate, endDate],
      queryFn: getSalesByPeriodRequest,
      enabled: isAuthenticated,
    });
  
    return { salesByPeriod: data, isLoading, isError };
  };

  
