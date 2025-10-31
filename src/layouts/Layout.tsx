import BottomNav from "@/components/BottomNav"
import SideNav from "@/components/SideNav"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { useLocation } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
  bgColor?: string
}


const Layout = ({children, bgColor = "bg-stone-100"}: LayoutProps) => {
  const location = useLocation();

  const pagesWithBottomNav = ["/tables", "/menu-cart", "/orders"];

  const showBottomNav = pagesWithBottomNav.includes(location.pathname);

  return (
    
    
    <SidebarProvider>
      <SideNav autoCollapse={showBottomNav}/>
      <main className={`container mx-auto flex-1 ${bgColor} pt-1`}> 
        <SidebarTrigger />
        {children}
      </main>
      {showBottomNav && <BottomNav />}
      <Toaster position="top-right" richColors />
    </SidebarProvider>
    
   
   
  )
}

export default Layout