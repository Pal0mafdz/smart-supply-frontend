import { useAuth0 } from "@auth0/auth0-react"
import {Navigate, Outlet} from "react-router-dom"
//protege las rutas, es decir hace que los usuarios no logeados no puedan meterse a ninguna ruta
//usando el buscador
const ProtectedRoute = () =>{
    const {isAuthenticated, isLoading}  = useAuth0();
   
    if(isLoading){
        return null;
    }

    if(isAuthenticated){
        //retorna todas las rutas
        return <Outlet/>;
    }

    //si no esta autenticado solo te regresa al homepage 
    return <Navigate to = "/" replace/>;

    

}

export default ProtectedRoute