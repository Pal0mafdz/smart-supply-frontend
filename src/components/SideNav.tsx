import { Button } from "./ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar
} from "./ui/sidebar"

import {
  Apple,
  BanknoteArrowUp,
  ChefHat,
  CookingPot,
  Trash2,
  User,
  Users,
  Utensils,
  Store,
  Package,
  ChevronDown,
  FileText
} from "lucide-react"



import { useAuth0 } from "@auth0/auth0-react"
import UsernameMenu from "./UsernameMenu"
import { Link, useLocation, useNavigate } from "react-router-dom"
import React from "react"
import { useGetCurrentUser } from "@/api/MyUserApi"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

type Role = "admin" | "jefe de cocina" | "contador" | "mesero" | "almacenista"| "gerente" | "unauthorized" |"capitan";


const SideNav = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const { state, toggleSidebar, open } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()
  const collapsed = state === "collapsed"
  const { currentUser, isLoading } = useGetCurrentUser()

  const collapsePages = ["/tables", "/menu-cart", "/waiter-orders"]
  const shouldCollapse = collapsePages.includes(location.pathname)

  const canAccess = (roles: Role[]) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };
  

  const handleSmartSupplyClick = () => {
    if (isLoading) return
    if (!currentUser) {
      navigate("/")
      return
    }

    switch (currentUser.role) {
      case "unauthorized":
        navigate("/user-unauthorized")
        break
      case "capitan":
        navigate("/captain-homepage")
        break
      case "admin":
        navigate("/admin-homepage")
        break
      case "contador":
      case "gerente":
        navigate("/admin-homepage")
        break
      case "mesero":
        navigate("/waiter-homepage")
        break
      case "jefe de cocina":
        navigate("/chef-homepage")
        break
      default:
        navigate("/")
    }
  }

  React.useEffect(() => {
    if (shouldCollapse && open) toggleSidebar()
    if (!shouldCollapse && !open) toggleSidebar()
  }, [shouldCollapse])

  React.useEffect(() => {
    if (!isAuthenticated && open) {
      toggleSidebar()
    }
  }, [isAuthenticated])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className="px-4 py-4 bg-gradient-to-br from-black via-stone-900 to-black text-stone-100 cursor-pointer hover:from-stone-900 hover:via-black hover:to-stone-900 transition-all duration-300 border-b border-stone-800"
        onClick={handleSmartSupplyClick}
      >
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-stone-300 to-stone-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <span className="text-black font-bold text-base">{collapsed ? "SS" : "S"}</span>
          </div>
          {!collapsed && (
            <h2 className="font-bold text-lg tracking-tight">SmartSupply</h2>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-black via-stone-950 to-black text-stone-100">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

          
            {canAccess(["admin", "jefe de cocina", "contador", "mesero", "almacenista", "gerente", "capitan"]) && (
              <Collapsible defaultOpen className="group/collapsible mt-2">
                <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                  <CollapsibleTrigger asChild>
                   
                     <SidebarMenuButton className="hover:!bg-stone-800/50 hover:!text-stone-100 hover:shadow-md transition-all duration-200 rounded-xl data-[state=open]:bg-transparent !p-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-stone-700 to-stone-900 rounded-xl flex items-center justify-center shadow-md shrink-0">
                      <Store className="h-5 w-5 text-stone-200" />
                    </div>
                    <span className="font-medium group-data-[collapsible=icon]:hidden ml-2">POS</span>

                    <ChevronDown
                      className="ml-auto h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden mr-2"
                    />
                      
                    </SidebarMenuButton>
                    
                  </CollapsibleTrigger>

                  
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-stone-700 ml-2">
                    {canAccess(["admin", "contador", "gerente"]) && (
                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:!bg-stone-800/50 hover:!text-stone-100 rounded-lg transition-all duration-200 ${
                            location.pathname === "/sales" ? "bg-gradient-to-r from-stone-700 to-stone-800 text-stone-100 shadow-md" : ""
                          }`}
                        >
                          <Link to="/sales" className="flex items-center space-x-3">
                            <BanknoteArrowUp className="h-4 w-4" />
                            <span>Ventas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    )}

{canAccess(["admin", "contador", "mesero", "gerente", "capitan"]) && (
                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:!bg-stone-800/50 hover:!text-stone-100 rounded-lg transition-all duration-200 ${
                            location.pathname === "/tables" ? "bg-gradient-to-r from-stone-700 to-stone-800 text-stone-100 shadow-md" : ""
                          }`}
                        >
                          <Link to="/tables" className="flex items-center space-x-3">
                            <Utensils className="h-4 w-4" />
                            <span>Mesas disponibles</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
)}


{canAccess(["admin","jefe de cocina",  "gerente"]) && (

                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:!bg-stone-800/50 hover:!text-stone-100 rounded-lg transition-all duration-200 ${
                            location.pathname === "/chef-orders" ? "bg-gradient-to-r from-stone-700 to-stone-800 text-stone-100 shadow-md" : ""
                          }`}
                        >
                          <Link to="/chef-orders" className="flex items-center space-x-3">
                            <ChefHat className="h-4 w-4" />
                            <span>Órdenes</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
)}

                      <SidebarMenuSubItem>
                      
                        <SidebarMenuButton
                          asChild
                          className={`hover:!bg-stone-800/50 hover:!text-stone-100 rounded-lg transition-all duration-200 ${
                            location.pathname === "/cash" ? "bg-gradient-to-r from-stone-700 to-stone-800 text-stone-100 shadow-md" : ""
                          }`}
                        >
                          <Link to="/cash" className="flex items-center space-x-3">
                            <FileText className="h-4 w-4"/>
                            <span>Caja</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>



                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
          )}

        
              {canAccess(["admin", "almacenista", "contador"]) && (
              <Collapsible defaultOpen className="group/collapsible mt-2">
                <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:!bg-stone-800/50 hover:!text-stone-100 hover:shadow-md transition-all duration-200 rounded-xl data-[state=open]:bg-transparent !p-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-stone-700 to-stone-900 rounded-xl flex items-center justify-center shadow-md shrink-0">
                      <Package className="h-5 w-5 text-stone-200" />
                    </div>
                    <span className="font-medium group-data-[collapsible=icon]:hidden ml-2">Almacén</span>

                    <ChevronDown
                      className="ml-auto h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden mr-2"
                    />
                      
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub className="border-stone-700 ml-2">
                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:!bg-stone-800/50 hover:!text-stone-100 rounded-lg transition-all duration-200 ${
                            location.pathname === "/inventory" ? "bg-gradient-to-r from-stone-700 to-stone-800 text-stone-100 shadow-md" : ""
                          }`}
                        >
                          <Link to="/inventory" className="flex items-center space-x-3">
                            <Apple className="h-4 w-4" />
                            <span>Inventario</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      
                      {canAccess(["admin", "contador"]) && (
                      <SidebarMenuSubItem>
                        <SidebarMenuButton 
                          asChild
                          className={`hover:!bg-stone-800/50 hover:!text-stone-100 rounded-lg transition-all duration-200 ${
                            location.pathname === "/recipes" ? "bg-gradient-to-r from-stone-700 to-stone-800 text-stone-100 shadow-md" : ""
                          }`}
                        >
                          <Link to="/recipes" className="flex items-center space-x-3">
                            <CookingPot className="h-4 w-4" />
                            <span>Recetario</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    )}

                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:!bg-stone-800/50 hover:!text-stone-100 rounded-lg transition-all duration-200 ${
                            location.pathname === "/shrinkage" ? "bg-gradient-to-r from-stone-700 to-stone-800 text-stone-100 shadow-md" : ""
                          }`}
                        >
                          <Link to="/shrinkage" className="flex items-center space-x-3">
                            <Trash2 className="h-4 w-4" />
                            <span>Mermas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              )}

              {canAccess(["admin"]) && (
              <SidebarMenuItem className="mt-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton 
                  asChild
                  className={`hover:!bg-stone-800/50 hover:!text-stone-100 hover:shadow-md transition-all duration-200 rounded-xl !p-1 ${
                    location.pathname === "/get-users" ? "bg-gradient-to-r from-stone-700 to-stone-800 text-stone-100 shadow-md" : ""
                  }`}
                >
                  <Link to="/get-users" className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-stone-700 to-stone-900 rounded-xl flex items-center justify-center shadow-md shrink-0">
                      <Users className="h-5 w-5 text-stone-200" />
                    </div>
                    <span className="font-medium group-data-[collapsible=icon]:hidden ml-2">Usuarios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          
              

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 bg-gradient-to-t from-black via-stone-900 to-black border-t border-stone-800">
        {isAuthenticated ? (
          <div className="hover:bg-stone-800/30 rounded-xl transition-all duration-200">
            <UsernameMenu />
          </div>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-stone-300 to-stone-400 text-black hover:from-stone-400 hover:to-stone-500 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
            onClick={async () =>
              await loginWithRedirect({
                appState: { returnTo: "/auth-callback" },
              })
            }
          >
            {collapsed ? <User className="h-5 w-5" /> : "Iniciar sesión"}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideNav
