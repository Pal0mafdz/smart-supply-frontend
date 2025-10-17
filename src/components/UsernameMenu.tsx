import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenu } from "./ui/dropdown-menu"
import { Avatar } from "./ui/avatar"
import { useAuth0 } from "@auth0/auth0-react"
import { AvatarImage } from "./ui/avatar"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"
import { AvatarFallback } from "./ui/avatar"

const UsernameMenu = () => {
    const {user, logout} = useAuth0();
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    const fallbackLetter = user?.email ? user.email.charAt(0).toUpperCase() : "U"
   

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <div
          className={`flex items-center gap-2 px-2 py-1 w-full overflow-hidden ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Avatar className="h-6 w-6">

            <AvatarFallback>{fallbackLetter}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <span className="truncate text-stone-300">{user?.email}</span>
          )}
        </div>
            
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="bg-stone-900 text-stone-300 ">
            <DropdownMenuItem>
            <Link to= "/user-profile">Perfil de Usuario</Link>
            </DropdownMenuItem>
            <DropdownMenuItem >
            <Button className="flex flex-1 bg-stone-600" onClick={()=> logout()}>Cerrar Sesion</Button>
            </DropdownMenuItem>
        </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default UsernameMenu

