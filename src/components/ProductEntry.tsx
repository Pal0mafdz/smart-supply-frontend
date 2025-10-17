
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import EntryProductForm from "@/forms/EntryProductForm"
import { useParams } from "react-router-dom"
import { useAddProduct, useGetProductById } from "@/api/MyProductApi"

const ProductEntry = () => {
  const { id: productId} = useParams();
  const {addProduct, isLoading: isAdding} = useAddProduct();
  const {product} = useGetProductById(productId);

  const handleSave = (formData: FormData)=>{
    addProduct(formData);
  }

  return (
    <Sheet>
  <SheetTrigger asChild>
   
  <Button className="bg-stone-950 hover:bg-stone-200 hover:text-stone-950">Registrar entrada</Button>
    
  </SheetTrigger>
  <SheetContent className="overflow-y-auto">
    <SheetHeader>
      <SheetTitle>Registra la entarda de tu producto</SheetTitle>
      <SheetDescription>
        Llena los siguentes campos para registrar una nueva entrada de producto.
      </SheetDescription>


    </SheetHeader>
    
   <div className="p-6">
    <EntryProductForm 
    product={product} onSave={handleSave} isLoading={isAdding}/>
   </div>

  </SheetContent>
</Sheet>
  )
}

export default ProductEntry