
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from '../ui/sheet'

import SupplierForm from '@/forms/SupplierForm'

import { useAddSupplier, useEditSupplier,} from '@/api/MySupplierApi';
import type { Supplier } from '@/types';

type Props = {
  supplier?: Supplier | null;
  open: boolean;
  onClose: () => void;
  title?: string;
}


const SheetSupplier = ({supplier, title, onClose, open}: Props) => {


    const {addSupplier, isLoading: isAdding} = useAddSupplier();
    const {editSupplier, isLoading: isEditing} = useEditSupplier();
 

    const handleSave = async (formData: FormData) => {
      
      if (supplier?._id) {
        await editSupplier({id: supplier?._id, supplierdata: formData})
      } else {
        console.log("Supplier", formData);
  
        await addSupplier(formData);
      }
      onClose()
     
    };

    // const isEditingMode = !!supplier;
    const sheetTitle = title || (isEditing ? "Editar" : "Registra a tu proveedor");
  
  
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>

    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>{sheetTitle}</SheetTitle>
        <SheetDescription>
          Llena correctamente los campos para dar de alta tus proveedores
        </SheetDescription>
  
  
      </SheetHeader>
      
     <div className="p-6">
      <SupplierForm onSave={handleSave} isLoading={isAdding} supplierData={supplier}/>
     </div>
  
    </SheetContent>
  </Sheet>
  )
}

export default SheetSupplier