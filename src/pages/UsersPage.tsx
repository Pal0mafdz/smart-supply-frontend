import { useGetMyUsers, useUpdateUserRole } from "@/api/MyUserApi"
import Spinner from "@/components/Spinner"
import { DataTable } from "@/components/tables/DataTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types"
// import { useQueryClient } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"


// export const columns: ColumnDef<User>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",

//   },
//   {
//     accessorKey:"email",
//     header: "Email",
//   },
//   {
//     accessorKey: "role",
//     header: "Role", 
//     cell: ({row})=> {
//       return(
//         <Select value={row.original.role} onValueChange={(newRole)=> handle}>
//           <SelectTrigger>
//             <SelectValue placeholder=""/>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="jefe de cocina">Jefe de cocina</SelectItem>
//             <SelectItem value="mesero">Mesero</SelectItem>

//           </SelectContent>
//         </Select>
//       )
//     }
//   }
  
// ]


const UsersPage = () => {
  const {users, isLoading} = useGetMyUsers();
  //User[]
  const {updateUserRole} = useUpdateUserRole();
 // const queryClient = useQueryClient(); 

  const handleRoleChange = async(userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, newRole });

      
    } catch (error) {
      console.error(error);
    }
  }
   
  const columns: ColumnDef<User>[] = [
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
      header: "Role", 
      cell: ({row})=> {
        return(
          <Select value={row.original.role} onValueChange={(newRole)=> handleRoleChange(row.original._id, newRole)}>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              
              <SelectItem value="unauthorized">Unauthorized</SelectItem>
              <SelectItem value="jefe de cocina">Jefe de cocina</SelectItem>
              <SelectItem value="mesero">Mesero</SelectItem>
              <SelectItem value="almacenista">Almacenista</SelectItem>
              <SelectItem value="contador">Contador</SelectItem>
              <SelectItem value="gerente">Gerente</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        )
      }
    }
    
  ]

  if(isLoading) return <Spinner/>
  
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