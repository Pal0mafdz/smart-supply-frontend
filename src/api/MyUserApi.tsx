import type { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
 import { useMutation, useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
    auth0Id: string;
    email:string;
    
}

export const useCreateMyUser = ()=> {
    const {getAccessTokenSilently} = useAuth0();
    const createMyUserRequest = async (user: CreateUserRequest)=>{
        const accessToken = await getAccessTokenSilently();
        
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify(user),
        })

        if(!response.ok){
            throw new Error("Failed to create user");
        }
    }

    const { mutateAsync: createUser, isPending:isLoading, isError, isSuccess} = useMutation({mutationFn:createMyUserRequest,});

    return {
        createUser,
        isLoading,
        isError,
        isSuccess,
    }

}

//tiene que regresar un arreglo con todos los usuarios
export const useGetMyUsers = () => {
    const {getAccessTokenSilently} = useAuth0();
    const getMyUsersRequest = async(): Promise<User[]> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/user/users`, {
            method: "GET",
            headers:{
                Authorization: `Bearer ${accessToken}`,
            }
        })

        if(!response.ok){
            throw new Error("Failed to fetch users");
        }
        return response.json();
    }

   // const {data: users, isLoading} = useQuery("fetchMyUsers", getMyUsersRequest);
   const {data: users, isLoading} = useQuery({queryKey: ["fetchMyUsers"], queryFn: getMyUsersRequest});

    return {users, isLoading};
}

