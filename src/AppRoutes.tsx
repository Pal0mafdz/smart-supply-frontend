import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";
import UsersPage from "./pages/UsersPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import AuthCallBackPage from "./pages/AuthCallBackPage";
import GetStarted from "./pages/GetStarted";
import WaitForAuthorization from "./pages/WaitForAuthorization";
import RoleProtectedRoute from "./auth/RoleProtectedRoute";



const AppRoutes = () => {
  return (
    //declaras las rutas de las paginas, cada ruta debe de tener Layout ya que es el componente
    //que lleva el SideNav
    <Routes>
       <Route path = "/auth-callback" element={<AuthCallBackPage/>}/>
        <Route path="/" element={<Layout><GetStarted/></Layout>}/>

        <Route element={<RoleProtectedRoute allowedRoles={["admin"]}/>}>
          <Route path="/get-users" element={<Layout><UsersPage/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador", "gerente", "jefe de cocina", "mesero"]}/>}>
          <Route path="/home-page" element={<Layout><HomePage/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["unauthorized"]}/>}>
          <Route path="/user-unauthorized" element={<Layout><WaitForAuthorization/></Layout>}/>
        </Route> 




        <Route path="/ordenes"/>

        <Route path="/mesas"/>
        <Route path="/storage" element={<span>Storage</span>}/>
        <Route path="*"element={<Navigate to ="/"/>}/>
    </Routes>
  )
}

export default AppRoutes;