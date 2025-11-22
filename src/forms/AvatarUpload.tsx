import { useRef } from "react"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AspectRatio } from "@/components/ui/aspect-ratio"

type Props = {
  field: any
}

const AvatarUpload = ({ field }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <FormItem>
      <FormLabel>Foto de Perfil</FormLabel>

      <FormControl>
        <div className="flex flex-col gap-3 items-start">

      
          <div
            className="w-40 h-40 rounded-lg overflow-hidden bg-gray-200 border cursor-pointer relative group"
            onClick={() => fileInputRef.current?.click()}
          >
            <AspectRatio ratio={1}>
              {field.value ? (
                <img
                  src={
                    typeof field.value === "string"
                      ? field.value
                      : URL.createObjectURL(field.value[0])
                  }
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Subir foto
                </div>
              )}
            </AspectRatio>


            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-sm">
              Cambiar foto
            </div>
          </div>

          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => field.onChange(e.target.files)}
          />
        </div>
      </FormControl>

      <FormMessage />
    </FormItem>
  )
}

export default AvatarUpload
