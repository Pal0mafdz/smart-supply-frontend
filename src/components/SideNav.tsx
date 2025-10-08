import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"

import { Apple, BanknoteArrowUp, ChefHat, CookingPot,   Trash2,  User,  Users, Utensils } from "lucide-react"
import { useAuth0 } from "@auth0/auth0-react"
import UsernameMenu from "./UsernameMenu"
import { Link, useLocation } from "react-router-dom"

const items = [
  {
      title: "Usuarios",
      url: "/get-users",
      icon: Users,

  },
  {
    title: "Ventas",
    url: "#",
    icon: BanknoteArrowUp,
  },
  {
    title: "Inventario",
    url: "/inventory",
    icon: Apple,
  },
  {
    title: "Recetario",
    url: "/recipes",
    icon: CookingPot,
  },
  {
    title: "Mermas",
    url: "#",
    icon: Trash2,
  },
  {
    title: "Ordenes",
    url: "#",
    icon: ChefHat,
  },

  {
    title: "Mesas disponibles",
    url: "#",
    icon: Utensils,
  },
  
  
]

const SideNav = () => {

  const {loginWithRedirect, isAuthenticated} = useAuth0();
  const {state} = useSidebar();
  

  //estado del item
  const location = useLocation();
  const collapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader className="px-4 py-3 bg-zinc-950 text-zinc-300">
            <h2>{collapsed? "SS" : "SmartSupply"}</h2>
        </SidebarHeader>
        <Separator className="bg-zinc-700"/>
      <SidebarContent className="bg-zinc-950 text-zinc-300">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                
                  <SidebarMenuButton
                    asChild
                    className={`hover:bg-zinc-300 ${
                      location.pathname === item.url ? "bg-zinc-300 text-zinc-950" : ""
                    }`}
                  >
                    <Link to={item.url} className="flex items-center space-x-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>

                  {/* </SidebarMenuButton> */}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator className="bg-zinc-700"/>
      <SidebarFooter className="px-4 py-3 bg-zinc-950">
       
          {isAuthenticated? (
            <UsernameMenu/>
          ):(
            <Button className="w-full bg-zinc-300 text-zinc-950 hover:bg-zinc-700 hover:text-zinc-300" onClick={async () => await loginWithRedirect()}>
              {collapsed?<User className="h-5 w-5"/> :  "Iniciar Sesion"}
              </Button>
          )}
        
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideNav