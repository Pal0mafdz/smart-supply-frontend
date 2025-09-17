
import autorizar from "../assets/autorizar.png"

const WaitForAuthorization = () => {
  return (
     <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md text-center">
        <img src={autorizar} className="w-full"/>
        <div className="mt-4 text-lg">
            <p> Woops!... Espera a que el administrador autorice el acceso</p>
        </div>
      </div>
    </div>

  )
}

export default WaitForAuthorization