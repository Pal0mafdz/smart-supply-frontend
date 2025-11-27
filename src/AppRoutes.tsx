import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";
import UsersPage from "./pages/UsersPage";
import AuthCallBackPage from "./pages/AuthCallBackPage";
import GetStarted from "./pages/GetStarted";
import WaitForAuthorization from "./pages/WaitForAuthorization";
import RoleProtectedRoute from "./auth/RoleProtectedRoute";
import InventoryPage from "./pages/InventoryPage";
import MovementsPage from "./pages/MovementsPage";
import RecipesPage from "./pages/RecipesPage";
import TablesPage from "./pages/TablesPage";
import CartPage from "./pages/CartPage";
import SuppliersPage from "./pages/SuppliersPage";
import WaiterOrdersPage from "./pages/WaiterOrdersPage";
import ChefOrdersPage from "./pages/ChefOrdersPage";
import WaiterHomePage from "./pages/HOMEPAGES/WaiterHomePage";
import ChefHomePage from "./pages/HOMEPAGES/ChefHomePage";
import AdminHomePage from "./pages/HOMEPAGES/AdminHomePage";
import CaptainHomePage from "./pages/HOMEPAGES/CaptainHomePage";
import UserProfile from "./pages/UserProfile";
import SalesPage from "./pages/SalesPage";
import CashSessionPage from "./pages/CashSessionPage";
import ShrinkagePage from "./pages/ShrinkagePage";
import LowStockSupplierAI from "./components/LowStockSupplierAI";
import PaymentsPage from "./pages/PaymentsPage";



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

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador", "gerente", "jefe de cocina", "mesero", "capitan"]}/>}>
          <Route path="/user-profile" element={<Layout><UserProfile/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["unauthorized", "admin", "almacenista", "contador", "gerente", "jefe de cocina", "mesero"]}/>}>
          <Route path="/user-unauthorized" element={<Layout><WaitForAuthorization/></Layout>}/>
        </Route> 

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador"]}/>}>
          <Route path="/inventory" element={<Layout><InventoryPage/></Layout>}/>
        </Route> 

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador", "capitan"]}/>}>
          <Route path="/cash" element={<Layout><CashSessionPage/></Layout>}/>
        </Route> 

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador"]}/>}>
          <Route path="/shrinkage" element={<Layout><ShrinkagePage/></Layout>}/>
        </Route> 
        



        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador"]}/>}>
          <Route path="/movements-inventory" element={<Layout><MovementsPage/></Layout>}/>
        </Route> 

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador"]}/>}>
          <Route path="/sales" element={<Layout><SalesPage/></Layout>}/>
        </Route> 

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador"]}/>}>
          <Route path="/payments" element={<Layout><PaymentsPage/></Layout>}/>
        </Route> 

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "almacenista", "contador"]}/>}>
          <Route path="/suppliers" element={<Layout><SuppliersPage/></Layout>}/>
        </Route> 

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "contador"]}/>}>
          <Route path="/recipes" element={<Layout><RecipesPage/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "mesero", 'gerente', 'capitan']}/>}>
          <Route path="/tables" element={<Layout><TablesPage/></Layout>}/>
        </Route>
        
        <Route element={<RoleProtectedRoute allowedRoles={["admin", "mesero", 'gerente']}/>}>
          <Route path="/menu-cart" element={<Layout><CartPage/></Layout>}/>
        </Route>
        
        <Route element={<RoleProtectedRoute allowedRoles={["admin", "jefe de cocina", 'gerente', "capitan"]}/>}>
          <Route path="/chef-orders" element={<Layout><ChefOrdersPage/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "mesero", 'gerente', 'capitan']}/>}>
          <Route path="/waiter-orders" element={<Layout><WaiterOrdersPage/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["mesero"]}/>}>
          <Route path="/waiter-homepage" element={<Layout><WaiterHomePage/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["jefe de cocina"]}/>}>
          <Route path="/chef-homepage" element={<Layout><ChefHomePage/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "contador", "gerente"]}/>}>
          <Route path="/admin-homepage" element={<Layout><AdminHomePage/></Layout>}/>
        </Route>
        
        <Route element={<RoleProtectedRoute allowedRoles={["admin", "capitan", "gerente"]}/>}>
          <Route path="/captain-homepage" element={<Layout><CaptainHomePage/></Layout>}/>
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["admin", "capitan", "gerente"]}/>}>
          <Route path="/ai" element={<Layout><LowStockSupplierAI/></Layout>}/>
        </Route>



        <Route path="*"element={<Navigate to ="/"/>}/>
    </Routes>
  )
}

export default AppRoutes;