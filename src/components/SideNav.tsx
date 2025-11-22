import { Separator } from "./ui/separator"
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
      case "admin":
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
        className="px-4 py-3 bg-black text-stone-300 cursor-pointer"
        onClick={handleSmartSupplyClick}
      >
        <h2>{collapsed ? "SS" : "SmartSupply"}</h2>
      </SidebarHeader>
      <Separator className="bg-stone-300" />
      <SidebarContent className="bg-black text-cream">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

          
              <Collapsible defaultOpen className="group/collapsible mt-2">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                   
                     <SidebarMenuButton className="hover:bg-stone-300">
                    <div className="flex items-center space-x-2">
                        <Store className="h-4 w-4" />
                       
                        <span>POS</span>
                      </div>

                      <ChevronDown
                          className="ml-auto h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180"
                       />
                      
                    </SidebarMenuButton>
                    
                  </CollapsibleTrigger>

                  
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-stone-600">
                    {canAccess(["admin", "contador", "gerente"]) && (
                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-stone-300 ${
                            location.pathname === "/sales" ? "bg-stone-300 text-black" : ""
                          }`}
                        >
                          <Link to="/sales" className="flex items-center space-x-2">
                            <BanknoteArrowUp className="h-4 w-4" />
                            <span>Ventas</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    )}

                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-stone-300 ${
                            location.pathname === "/tables" ? "bg-stone-300 text-black" : ""
                          }`}
                        >
                          <Link to="/tables" className="flex items-center space-x-2">
                            <Utensils className="h-4 w-4" />
                            <span>Mesas disponibles</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-stone-300 ${
                            location.pathname === "/chef-orders" ? "bg-stone-300 text-black" : ""
                          }`}
                        >
                          <Link to="/chef-orders" className="flex items-center space-x-2">
                            <ChefHat className="h-4 w-4" />
                            <span>Órdenes</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                      
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-stone-300 ${
                            location.pathname === "/cash" ? "bg-stone-300 text-black" : ""
                          }`}
                        >
                          <Link to="/cash" className="flex items-center space-x-2">
                            <FileText className="h-4 w-4"/>
                            <span>Caja</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>



                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

        
              {canAccess(["admin", "almacenista", "contador"]) && (
              <Collapsible defaultOpen className="group/collapsible mt-2">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-stone-300">
                    <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                       
                        <span>Almacen</span>
                      </div>

                      <ChevronDown
                          className="ml-auto h-4 w-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180"
                       />
                      
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub className="border-stone-600">
                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-stone-300 ${
                            location.pathname === "/inventory" ? "bg-stone-300 text-black" : ""
                          }`}
                        >
                          <Link to="/inventory" className="flex items-center space-x-2">
                            <Apple className="h-4 w-4" />
                            <span>Inventario</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>

                      
                      {canAccess(["admin", "contador"]) && (
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <Link to="/recipes" className="flex items-center space-x-2">
                            <CookingPot className="h-4 w-4" />
                            <span>Recetario</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    )}

                      <SidebarMenuSubItem>
                        <SidebarMenuButton
                          asChild
                          className={`hover:bg-stone-300 ${
                            location.pathname === "/shrinkage" ? "bg-stone-300 text-black" : ""
                          }`}
                        >
                          <Link to="/shrinkage" className="flex items-center space-x-2">
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/get-users" className="flex items-center space-x-2">
                    <Users />
                    <span>Usuarios</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          
              

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Separator className="bg-stone-300" />
      <SidebarFooter className="px-4 py-3 bg-black">
        {isAuthenticated ? (
          <UsernameMenu />
        ) : (
          <Button
            className="w-full bg-stone-300 text-black hover:bg-stone-700 hover:text-stone-300"
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
