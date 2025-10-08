
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import EntryProductForm from "@/forms/EntryProductForm"
import { useParams } from "react-router-dom"
import { useAddProduct, useEditProduct, useGetProductById } from "@/api/MyProductApi"



const ProductEntry = () => {
  const { id: productId} = useParams();
  const {addProduct, isLoading: isAdding} = useAddProduct();
 // const {editProduct, isLoading: isEditLoading} = useEditProduct();
  const {product} = useGetProductById(productId);

  //const isEditing= !!productId?.trim();


  const handleSave = (formData: FormData)=>{
    addProduct(formData);
    // if(isEditing && productId){
    //   editProduct({productId, productFormData: formData});

    // }else{
    //   addProduct(formData);
    // }
  }

  return (
    <Sheet>
  <SheetTrigger asChild>
   
  <Button>Registrar entrada</Button>
    
  </SheetTrigger>
  <SheetContent>
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