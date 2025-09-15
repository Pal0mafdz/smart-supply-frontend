import { useAuth0 } from "@auth0/auth0-react";
import chart from "../assets/chart.png"; 
import { Button } from "@/components/ui/button";


const GetStarted = () => {

  const {loginWithRedirect, isAuthenticated} = useAuth0();
  
  return (
    // <div className="flex justify-center p-7 ">
    //   <div className="w-full">
    //     <img src={chart} className="w-100"/>
    //     {/* <h1>homepage</h1> */}
    //   </div>
    // </div>
   
    <div className="flex justify-center items-center p-10 min-h-screen bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl items-center">
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-zinc-800">
            Bienvenido a SmartSupply
          </h1>
          <p className="text-lg text-zinc-600">
            Administra usuarios, controla tus ventas y gestiona inventario con facilidad. 
            Una herramienta diseñada para optimizar tu negocio.
          </p>
          <Button onClick={async () => await loginWithRedirect()}className="px-8 py-6 bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 ">
            Empieza ahora
          </Button>
        </div>

        
        <div className="flex justify-center">
          <img src={chart} alt="Dashboard chart" className="max-w-md w-full" />
        </div>

      </div>
    </div>
   
   
  )
}

export default GetStarted