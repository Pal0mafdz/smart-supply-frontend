import z from "zod"

const formSchema = z.object({
        codeNum: z.string().min(1, "El código es requerido"),
        name: z.string().min(1, "El nombre es requerido"),
        category: z.string().min(1, "Selecciona una categoría"),
        unit: z.string().min(1, "La unidad es requerida"),
        quantityInStock: z.coerce.number().min(1, { message: "Debe ser mayor que 0" }),
        unitprice: z.coerce.number().min(0.01, { message: "Debe ser mayor que 0" }),
    
})

const DeclareMovementForm = () => {
  return (
    <div>DeclareMovementForm</div>
  )
}

export default DeclareMovementForm