import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenu } from "./ui/dropdown-menu"
import { Avatar } from "./ui/avatar"
import { useAuth0 } from "@auth0/auth0-react"
import { AvatarImage } from "./ui/avatar"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"

const UsernameMenu = () => {
    const {user, logout} = useAuth0();
    const { state } = useSidebar();
    const collapsed = state === "collapsed";
   

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <div
          className={`flex items-center gap-2 px-2 py-1 w-full overflow-hidden ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.picture} />
          </Avatar>
          {!collapsed && (
            <span className="truncate text-white">{user?.email}</span>
          )}
        </div>
            
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>
            <Link to= "/user-profile" className=" hover:bg-gray">Perfil de Usuario</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <Button className="flex flex-1 bg-zinc-600" onClick={()=> logout()}>Cerrar Sesion</Button>
            </DropdownMenuItem>
        </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default UsernameMenu

