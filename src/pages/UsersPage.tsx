import { useGetMyUsers } from "@/api/MyUserApi"
import Spinner from "@/components/Spinner"
import { DataTable } from "@/components/tables/DataTable"
import type { User } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",

  },
  {
    accessorKey:"email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role"
  }
  
]


const UsersPage = () => {
  const {users, isLoading} = useGetMyUsers();
  // console.log(users);

  if(isLoading){
     return <Spinner/>
    // // return <p className="text-center">Cargando...</p>
    
  }
  return (

    <div className="flex justify-center p-7 ">
      <div className="w-full ">
        {/* <h2>Usuarios</h2> */}
        <DataTable columns={columns} data={users ??[]}/>
      </div>
    </div>
  )
}

export default UsersPage