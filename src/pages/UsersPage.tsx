import { useGetMyUsers, useUpdateUserRole } from "@/api/MyUserApi"
import Spinner from "@/components/Spinner"
import { UsersTable } from "@/components/tables/UsersTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"

const UsersPage = () => {
  const {users, isLoading} = useGetMyUsers();
  const {updateUserRole} = useUpdateUserRole();

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
      header: "Nombre",
  
    },
    {
      header:"Correo",
      accessorFn: (row) => row.email,
      // accessorKey:"email",
      // header: "Email",
    },
    {
      accessorKey: "role",
      header: "Rol", 
      cell: ({row})=> {
        return(
          <Select value={row.original.role} onValueChange={(newRole)=> handleRoleChange(row.original._id, newRole)}>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              
            <SelectItem value="capitan">Capitan</SelectItem>
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
        {/* <DataTable columns={columns} data={users ??[]}/> */}
        <UsersTable columns={columns} data={users ??[]}/>
      </div>
    </div>
  )
}

export default UsersPage