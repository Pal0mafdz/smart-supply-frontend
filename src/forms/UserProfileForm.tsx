// import { z } from "zod"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { useEffect } from "react"
// import type { User } from "@/types"
// import { Spinner } from "@/components/ui/spinner"
// import { Select } from "@radix-ui/react-select"
// import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import AvatarUpload from "./AvatarUpload"

// const formSchema = z.object({
//   email: z.string().email("Debe ser un correo válido").optional(),
//   role: z.string().min(1,"Debe ser rol valido").optional(),
//   name: z.string().min(1, "El nombre es requerido"),
//   lastname: z.string().min(1, "El apellido es requerido"),
//   bio: z.string().min(1, "La descripción es requerida"),
//   gender: z.enum(["", "femenino", "masculino", "no binario", "otro", "prefiero no decirlo"]).optional(),
//   phone: z.string().min(1, "El teléfono es requerido"),
//   avatarUrl: z
//     .any()
//     .optional()
//     .refine(
//       (file) => !file || file?.length > 0,
//       "La imagen es requerida"
//     ),
// })

// export type UserFormData = z.infer<typeof formSchema>

// type Props = {
//   currentUser: User
//   onSave: (userProfileData: UserFormData) => void
//   isLoading: boolean
//   title?: string
//   buttonText?: string
// }

// const UserProfileForm = ({
//   onSave,
//   isLoading,
//   currentUser,
//   title = "Tu Perfil",
//   buttonText = "Guardar",
// }: Props) => {
//   const form = useForm<UserFormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: currentUser,
//   })

//   useEffect(() => {
//     form.reset(currentUser)
//   }, [currentUser, form])

//   const onSubmit = async (formDataJson: UserFormData) => {
//     const formData = new FormData();
//     formData.append("name", formDataJson.name);
//     formData.append("lastname", formDataJson.lastname);
//     formData.append("bio", formDataJson.bio);
//     formData.append("gender", JSON.stringify(formDataJson.gender));
//     formData.append("phone", formDataJson.phone);
//     if (formDataJson.avatarUrl?.[0]) {
//       formData.append("image", formDataJson.avatarUrl[0]);
//     }
//     onSave(formData);
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSave)}
//         className="space-y-4 bg-white rounded-lg md:p-10"
//       >
//         <div>
//           <h2 className="text-2xl font-bold">{title}</h2>
//           <FormDescription>
//             Visualiza y edita tu informacion personal
//           </FormDescription>
//         </div>



//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input {...field} disabled className="bg-white border-stone-400" />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//                 <FormField
//                   control={form.control}
//                   name="avatarUrl"
//                   render={({ field }) => <AvatarUpload field={field} />}
//                   />
      


//       <FormField
//           control={form.control}
//           name="role"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Rol Asignado</FormLabel>
//               <FormControl>
//                 <Input {...field} disabled className="bg-white border-stone-400" />
//               </FormControl>
//             </FormItem>
//           )}
//         />

//       <div className="flex flex-col md:flex-row gap-4">
//           <FormField
//             control={form.control}
//             name="lastname"
//             render={({ field }) => (
//               <FormItem className="flex-1">
//                 <FormLabel>Nombre</FormLabel>
//                 <FormControl>
//                   <Input {...field} className="bg-white border-stone-400" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="bio"
//             render={({ field }) => (
//               <FormItem className="flex-1">
//                 <FormLabel>Apellido</FormLabel>
//                 <FormControl>
//                   <Input {...field} className="bg-white border-stone-400" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           </div>

//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Descripcion</FormLabel>
//               <FormControl>
//                 <Input {...field} className="bg-white border-stone-400" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="gender"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Genero</FormLabel>
//               <FormControl>
//               <Select value={field.value}
//                   onValueChange={(val) => field.onChange(val)}>
//                 <SelectTrigger className="w-m-sm border-stone-400">
//                   <SelectValue placeholder="Selecciona tu genero" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="femenino">Femenino</SelectItem>
//                   <SelectItem value="masculino">Masculino</SelectItem>
//                   <SelectItem value="no binario">No binario</SelectItem>
//                   <SelectItem value="otro">Otro</SelectItem>
//                   <SelectItem value="prefiero no decirlo">Prefiero no decirlo</SelectItem>
//                 </SelectContent>
//               </Select>
              
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
        
//         <FormField
//           control={form.control}
//           name="phone"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Teléfono</FormLabel>
//               <FormControl>
//                 <Input {...field} className="bg-white border-stone-400" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {isLoading ? (
//           <Spinner />
//         ) : (
//           <Button type="submit" className="bg-cyan-800">
//             {buttonText}
//           </Button>
//         )}
//       </form>
//     </Form>
//   )
// }

// export default UserProfileForm

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import type { User } from "@/types"
import { Spinner } from "@/components/ui/spinner"
import { Select } from "@radix-ui/react-select"
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AvatarUpload from "./AvatarUpload"

const formSchema = z.object({
  email: z.string().email("Debe ser un correo válido").optional(),
  role: z.string().min(1, "Debe ser rol válido").optional(),
  name: z.string().min(1, "El nombre es requerido"),
  lastname: z.string().min(1, "El apellido es requerido"),
  bio: z.string().min(1, "La descripción es requerida"),
  gender: z.enum([
    "",
    "femenino",
    "masculino",
    "no binario",
    "otro",
    "prefiero no decirlo"
  ]).optional(),
  phone: z.string().min(1, "El teléfono es requerido"),
  avatarUrl: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.length > 0,
      "La imagen es requerida"
    ),
})

export type UserFormData = z.infer<typeof formSchema>

type Props = {
  currentUser: User
  onSave: (userProfileData: FormData) => void  
  isLoading: boolean
  title?: string
  buttonText?: string
}

const UserProfileForm = ({
  onSave,
  isLoading,
  currentUser,
  title = "Tu Perfil",
  buttonText = "Guardar",
}: Props) => {

  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: currentUser.email || "",
    role: currentUser.role || "",
    name: currentUser.name || "",
    lastname: currentUser.lastname || "",
    bio: currentUser.bio || "",
    gender: currentUser.gender || "",
    phone: currentUser.phone || "",
    avatarUrl: undefined, 
    }

  })

  useEffect(() => {
    form.reset({
      email: currentUser.email || "",
      role: currentUser.role || "",
      name: currentUser.name || "",
      lastname: currentUser.lastname || "",
      bio: currentUser.bio || "",
      gender: currentUser.gender || "",
      phone: currentUser.phone || "",
      avatarUrl: currentUser.avatarUrl,
    })
  }, [currentUser, form])
 
 
  const onSubmit = async (formDataJson: UserFormData) => {
    const formData = new FormData()

    formData.append("name", formDataJson.name);
    formData.append("lastname", formDataJson.lastname);
    formData.append("bio", formDataJson.bio);
    formData.append("gender", formDataJson.gender ?? "");
    formData.append("phone", formDataJson.phone);

    if (formDataJson.avatarUrl?.[0]) {
      formData.append("image", formDataJson.avatarUrl[0])
    }

    onSave(formData)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}   // 👈 CORREGIDO
        className="space-y-4 bg-white rounded-lg md:p-10"
      >
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <FormDescription>
            Visualiza y edita tu información personal
          </FormDescription>
        </div>

        {/* EMAIL */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-white border-stone-400" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* AVATAR */}
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => <AvatarUpload field={field} />}
        />

        {/* ROLE */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol Asignado</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-white border-stone-400" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* NOMBRE Y APELLIDO */}
        <div className="flex flex-col md:flex-row gap-4">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white border-stone-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white border-stone-400" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* DESCRIPCION */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white border-stone-400" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GENERO */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Género</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="w-m-sm border-stone-400">
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="no binario">No binario</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                    <SelectItem value="prefiero no decirlo">Prefiero no decirlo</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TELEFONO */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white border-stone-400" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BOTÓN */}
        {isLoading ? (
          <Spinner />
        ) : (
          <Button type="submit" className="bg-cyan-800">
            {buttonText}
          </Button>
        )}

      </form>
    </Form>
  )
}

export default UserProfileForm
