import SideNav from "@/components/SideNav"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
      <SideNav/>
      <main className="container mx-auto flex-1"> 
        <SidebarTrigger />
        {children}
      </main>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
   
   
  )
}

export default Layout