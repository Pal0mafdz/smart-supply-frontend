import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenu } from "./ui/dropdown-menu"
import { Avatar, AvatarImage } from "./ui/avatar"
import { useAuth0 } from "@auth0/auth0-react"

import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useSidebar } from "./ui/sidebar"
import { AvatarFallback } from "./ui/avatar"
import { useGetCurrentUser } from "@/api/MyUserApi"


const UsernameMenu = () => {
    const { logout } = useAuth0();

    const { state, setOpen} = useSidebar();
    const collapsed = state === "collapsed";

    const {currentUser, isLoading} = useGetCurrentUser();

    if(isLoading) return null;

    const avatarSrc = currentUser?.avatarUrl || undefined;

    const fallbackLetter = currentUser?.name
    ? currentUser.name.charAt(0).toUpperCase()
    : currentUser?.email
    ? currentUser.email.charAt(0).toUpperCase()
    : "U";

  

   

  return (
    <DropdownMenu onOpenChange={(open)=> {
      if(open && state === "collapsed") {
        setOpen
      }
    }}>
        <DropdownMenuTrigger asChild>
        <div
          className={`
            flex items-center w-full cursor-pointer
            ${collapsed ? "justify-center px-0" : "gap-3 px-3 py-2"}
            hover:bg-stone-800/30 rounded-xl transition-all duration-200
          `}
        >
          <Avatar className="h-9 w-9 rounded-lg shadow-md border-2 border-stone-700">
            {avatarSrc && <AvatarImage src={avatarSrc} />}
            
            <AvatarFallback className="rounded-lg bg-gradient-to-br from-stone-600 to-stone-800 text-stone-100 font-semibold">
              {fallbackLetter}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex flex-col flex-1 min-w-0">
              <span className="truncate text-stone-100 font-medium text-sm">
                {currentUser?.name
                  ? `${currentUser.name} ${currentUser.lastname ?? ""}`.trim()
                  : currentUser?.email}
              </span>
              <span className="text-xs text-stone-400 truncate">
                {currentUser?.email}
              </span>
            </div>
          )}
         
        </div>
            
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="right" 
          className="bg-gradient-to-b from-stone-900 to-black text-stone-100 border-stone-700 shadow-xl rounded-xl min-w-[220px]"
        >
          <div className="px-3 py-3 border-b border-stone-700/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-lg shadow-md border-2 border-stone-600">
                {avatarSrc && <AvatarImage src={avatarSrc} />}
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-stone-600 to-stone-800 text-stone-100 font-semibold">
                  {fallbackLetter}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-sm">
                  {currentUser?.name
                    ? `${currentUser.name} ${currentUser.lastname ?? ""}`.trim()
                    : "Usuario"}
                </span>
                <span className="text-xs text-stone-400 truncate">
                  {currentUser?.email}
                </span>
              </div>
            </div>
          </div>
            
          <DropdownMenuItem className="hover:bg-stone-800/50 cursor-pointer rounded-lg mx-1 my-1">
            <Link to="/user-profile" className="w-full">Perfil de Usuario</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-stone-800/50 cursor-pointer rounded-lg mx-1 my-1">
            <Button 
              className="flex flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-md transition-all duration-200" 
              onClick={() => logout()}
            >
              Cerrar Sesión
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default UsernameMenu

