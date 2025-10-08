import type { Movement } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



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