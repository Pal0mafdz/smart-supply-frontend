import { useGetCurrentUser } from "@/api/MyUserApi"
import Spinner from "@/components/Spinner";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

type Role = "admin" | "jefe de cocina" | "contador" | "mesero" | "almacenista"| "gerente" | "unauthorized" |"capitan";


interface Props {
    allowedRoles: Role[];
    redirectPath?: string;
}

const RoleProtectedRoute = ({allowedRoles, redirectPath = "/user-unauthorized"}: Props)=> {

     const {currentUser, isLoading: userLoading} = useGetCurrentUser();
     const {isAuthenticated, isLoading} = useAuth0();

     if(isLoading || userLoading) return <Spinner/>;

     if(!isAuthenticated) return <Navigate to = "/" replace/>

     if(!currentUser || !allowedRoles.includes(currentUser.role)){
        if(currentUser?.role === "unauthorized"){
            return <Navigate to="/user-unauthorized" replace/>;
        }
        return <Navigate to ={redirectPath} replace/>
     }

     return <Outlet/>

}

export default RoleProtectedRoute