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

  const pagesWithBottomNav = ["/tables", "/menu-cart", "/waiter-orders"];

  const showBottomNav = pagesWithBottomNav.includes(location.pathname);

  return (


    <SidebarProvider>
   
      <div className="flex h-screen w-screen">
 
        <SideNav />


        <div className={`flex flex-1 flex-col w-full ${bgColor}`}>
 
          <main className="flex-1 overflow-y-auto overscroll-y-none">
            {/* Wrapper con padding y ancho máximo centrado */}
            <div className="w-full  sm:px-6 lg:px-8 pt-4 pb-6">
              <SidebarTrigger />
              {children}
            </div>
          </main>

          {showBottomNav && <BottomNav />}
        </div>
      </div>

      <Toaster position="top-right" richColors />
    </SidebarProvider>

   
   
  )
}

export default Layout