import SideNav from "@/components/SideNav"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
      <SideNav/>
      <main className="container mx-auto flex-1"> 
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
   
   
  )
}

export default Layout