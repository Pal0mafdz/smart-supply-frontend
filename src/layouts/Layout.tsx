import SideNav from "@/components/SideNav"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

interface LayoutProps {
  children: React.ReactNode
  bgColor?: string
}


const Layout = ({children, bgColor = "bg-stone-100"}: LayoutProps) => {
  return (
    
    <SidebarProvider>
      <SideNav/>
      <main className={`container mx-auto flex-1 ${bgColor} pt-1`}> 
        <SidebarTrigger />
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
    
   
   
  )
}

export default Layout