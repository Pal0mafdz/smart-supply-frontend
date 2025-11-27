import type { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
 import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

 import {toast} from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
    auth0Id: string;
    email:string;
    
}

type UpdateUserRoleRequest = {
    userId: string;
    newRole: string;
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

export const useUpdateUserRole = () => {
    const {getAccessTokenSilently} = useAuth0();
    const queryClient = useQueryClient();

    const updateUserRoleRequest = async({userId, newRole}: UpdateUserRoleRequest)=> {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId, newRole}),
        });

        if(!response.ok){
            throw new Error("Failed to update role");
        }
        return response.json();
    };
    const { mutateAsync: updateUserRole, isPending: isLoading } = useMutation({
        mutationFn: updateUserRoleRequest,
        onSuccess: () => {
          toast.success("Se ha actualizado el rol del usuario!!");
          queryClient.invalidateQueries({ queryKey: ["fetchMyUsers"] });
        },
        onError: (err: Error) => {
          toast.error(err.message || "Error al actualizar el rol");
        },
      });

    return { updateUserRole, isLoading};
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


export const useGetCurrentUser = ()=>{
    const {getAccessTokenSilently, isAuthenticated} = useAuth0();

    const getCurrentUserRequest = async(): Promise<User>=> {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            }
        })

        if(!response.ok){
            throw new Error("Failed to fetch user");
        }
        return response.json();
    }
    const {data: currentUser, isLoading} = useQuery({queryKey: ["fetchCurrentUser"], queryFn: getCurrentUserRequest, enabled: isAuthenticated,});

    return {currentUser, isLoading};

}


export const useUpdateMyUser = () =>{

    const{ getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();
    const useUpdateMyUserRequest = async (formData: FormData)=>{ 
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/user/profile`, {
            method: "PUT",
            headers:{
                Authorization: `Bearer ${accessToken}`,
               
            },
            body: formData,
        });

        if(!response.ok){
            throw new Error("Error al actualizar tu perfil");
        }
        return response.json();

    }

    const { mutateAsync: updateUserProfile, isPending: isLoading } = useMutation({
        mutationFn: useUpdateMyUserRequest,
        onSuccess: () => {
          toast.success("Se ha actualizado el Perfil");
          queryClient.invalidateQueries({ queryKey: ["fetchCurrentUser"] });
        },
        onError: (err: Error) => {
          toast.error(err.message || "Error al actualizar el rol");
        },
      });

    return { updateUserProfile, isLoading};
}