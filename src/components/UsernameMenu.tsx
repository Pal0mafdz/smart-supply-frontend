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
    const {user, logout} = useAuth0();

    const { state } = useSidebar();
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
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <div
          className={`
            flex items-center w-full 
            ${collapsed ? "justify-center px-0" : "gap-2 px-2"}
          `}
        >
          <Avatar className="h-8 w-8 rounded-md">
            {avatarSrc && <AvatarImage src={avatarSrc} />}
            
            <AvatarFallback className="rounded-md">
              {fallbackLetter}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
  <span className="truncate text-stone-300">
    {currentUser?.name
      ? `${currentUser.name} ${currentUser.lastname ?? ""}`.trim()
      : currentUser?.email}
  </span>
)}
          {/* {!collapsed && (
            <span className="truncate text-stone-300">{user?.email}</span>
          )} */}
         
        </div>
            
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="bg-stone-900 text-stone-300 ">
        {/* <div className="flex items-center gap-3 px-2 py-3 border-b border-stone-700">
    <Avatar className="h-10 w-10 rounded-md">
      {avatarSrc && <AvatarImage src={avatarSrc} />}
      <AvatarFallback className="rounded-md">
        {fallbackLetter}
      </AvatarFallback>
    </Avatar>

    <div className="flex flex-col">
      <span className="font-semibold">
        {user?.name} {user?.lastname}
      </span>
      <span className="text-xs text-stone-400 truncate max-w-[120px]">
        {user?.email}
      </span>
    </div>
  </div> */}
            
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

