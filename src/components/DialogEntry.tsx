// import { useEditProduct } from '@/api/MyProductApi';
// import type { Product } from '@/types';
// import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
// import { useEffect, useState } from 'react';
// import { DialogFooter, DialogHeader } from './ui/dialog';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field';
// import { Textarea } from './ui/textarea';
// import { Select, SelectItem } from './ui/select';



// type Props = {
//     product: Product;
//     open: boolean;
//     onClose: () => void;
// }

// const DialogEntry = ({product, open, onClose}: Props) => {
//     const [type, setType] = useState<"entrada" | "salida" | "merma">("entrada");
//     const [quantity, setQuantity] = useState(0);
//    // const [quantityInStock, setQuantityInStock] = useState(product.quantityInStock);
//     const [note, setNote] = useState("");
//     const {editProduct, isLoading} = useEditProduct();

//     useEffect(() => {
//       if (open) {
//         setQuantity(0);
//         setType("entrada")
//         setNote("");
//       }
//     }, [product, open]);

//     const handleSave = async() => {
//         await editProduct({
//             productId: product._id,
//             updates: {type, quantity, note},
//         })
//         onClose();
//     };

    

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//     <DialogContent className="!max-w-md">
//       <DialogHeader>
//         <DialogTitle>Editar producto</DialogTitle>
//       </DialogHeader>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSave();
//         }}
//       >
//         <FieldGroup>
//           <FieldSet>
//             <FieldLegend>Datos del producto</FieldLegend>
//             <FieldDescription>
//               Registra un movimiento en el inventario
//             </FieldDescription>

//             <Field>
//               <FieldLabel htmlFor='type'>Tipo de Movimiento</FieldLabel>
//               <Select>
//                 <SelectItem value='entrada'>Entrada</SelectItem>
//                 <SelectItem value='salida'>Salida</SelectItem>
//                 <SelectItem value='merma'>Merma</SelectItem>
//               </Select>
//             </Field>

//             <Field>
//               <FieldLabel htmlFor="name">Nombre</FieldLabel>
//               <Input id="name" value={product.name} disabled className='border-stone-400'/>
//             </Field>

//             <div className='flex gap-4'>
//             {/* <Field>
//               <FieldLabel htmlFor="quantity">Cantidad en stock</FieldLabel>
//               <Input
//               className='border-stone-400'
//                 id="quantity"
//                 type="number"
//                 value={quantityInStock}
//                 onChange={(e) => setQuantityInStock(Number(e.target.value))}
//               />
//             </Field> */}

//             <Field>
//               <FieldLabel htmlFor="unit">Unidad</FieldLabel>
//               <Input id="price" value={product.unit} disabled 
//               className='border-stone-400'/>
//             </Field>
//             </div>



//             <Field>
//               <FieldLabel htmlFor="name">Precio unitario</FieldLabel>
//               <div className="relative">
//         <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//         <Input
//           id="price"
//           value={Number(product.unitprice).toFixed(2)}
//           disabled
//           className="pl-6 border-stone-400"
//         />
//       </div>
              
             
//             </Field>

           
   


//             <Field>
//               <FieldLabel htmlFor="note">Nota</FieldLabel>
//               <Textarea
//                 id="note"
//                 placeholder="Ej. Ajuste de precio por cambio de proveedor"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 className="resize-none border-stone-400"
//               />
//             </Field>
//           </FieldSet>

//           <div className="pt-4">
//             <DialogFooter className="flex justify-end space-x-2">
//               <Button variant="outline" type="button" onClick={onClose}>
//                 Cancelar
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading ? "Guardando..." : "Guardar cambios"}
//               </Button>
//             </DialogFooter>
//           </div>
//         </FieldGroup>
//       </form>
//     </DialogContent>
//   </Dialog>
//   )
// }

// export default DialogEntry

import { useEditProduct } from '@/api/MyProductApi';
import type { Product } from '@/types';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { useEffect, useMemo, useState } from 'react';
import { DialogFooter, DialogHeader } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from './ui/field';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type MovementType = 'entrada' | 'salida' | 'merma';

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
};

const DialogEntry = ({ product, open, onClose }: Props) => {
  const [type, setType] = useState<MovementType>('entrada');
  const [quantity, setQuantity] = useState<number>(0);
  const [note, setNote] = useState('');
  const { editProduct, isLoading } = useEditProduct();

  // stock actual desde el producto
  const currentStock = product.quantityInStock ?? 0;

  // preview de stock resultante
  const previewStock = useMemo(() => {
    if (!quantity || quantity <= 0) return currentStock;

    if (type === 'entrada') {
      return currentStock + quantity;
    }

    // salida o merma → resta
    return Math.max(currentStock - quantity, 0);
  }, [currentStock, quantity, type]);

  useEffect(() => {
    if (open) {
      setQuantity(0);
      setType('entrada');
      setNote('');
    }
  }, [product, open]);

  const handleSave = async () => {
    if (quantity <= 0) return;

    await editProduct({
      productId: product._id,
      updates: {
        type,
        quantity,
        note,
      },
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-md">
        <DialogHeader>
          <DialogTitle>Movimiento de inventario</DialogTitle>
        </DialogHeader>
        <div className='overflow-y-auto '>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          
          <FieldGroup>
            <FieldSet>
              {/* <FieldLegend>Datos del producto</FieldLegend> */}
              <FieldDescription>
                Registra una entrada, salida o merma de este producto.
              </FieldDescription>

              {/* Tipo de movimiento */}
              <Field>
                <FieldLabel htmlFor="type">Tipo de Movimiento</FieldLabel>
                <Select
  value={type}
  onValueChange={(value: MovementType) => setType(value)}
>
  <SelectTrigger className="border-stone-400 bg-white">
    <SelectValue placeholder="Selecciona un tipo" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="entrada">Entrada</SelectItem>
    <SelectItem value="salida">Salida</SelectItem>
    <SelectItem value="merma">Merma</SelectItem>
  </SelectContent>
</Select>
              </Field>

            
              <Field>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <Input
                  id="name"
                  value={product.name}
                  disabled
                  className="border-stone-400 bg-white"
                />
              </Field>

             
              <div className="flex gap-4">
                 <Field className='flex-1'>
                <FieldLabel htmlFor="price">Precio unitario</FieldLabel>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="price"
                    value={Number(product.unitprice).toFixed(2)}
                    disabled
                    className="pl-6 border-stone-400 bg-white"
                  />
                </div>
              </Field>

                <Field className="flex-1">
                  <FieldLabel htmlFor="unit">Unidad</FieldLabel>
                  <Input
                    id="unit"
                    value={product.unit}
                    disabled
                    className="border-stone-400 bg-white"
                  />
                </Field>
              </div>

            <div className='flex gap-4'>
              <Field className='flex-1'>
                <FieldLabel htmlFor="movementQty">
                  Cantidad a {type === 'entrada' ? 'ingresar' : 'descontar'}
                </FieldLabel>
                <Input
                  id="movementQty"
                  type="number"
                  min={0}
                  step="0.01"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="border-stone-400 bg-white"
                />
              </Field>

              {/* Preview de stock resultante */}
              <Field className='flex-1'>
                <FieldLabel>Stock después del movimiento</FieldLabel>
                <Input
                  disabled
                  value={previewStock}
                  className="border-stone-400 bg-stone-100 font-semibold"
                />
              </Field>

              </div>
              {/* Precio unitario */}
             

              {/* Nota (importante para Merma) */}
              <Field>
                <FieldLabel htmlFor="note">
                  Nota {type === 'merma' && '(motivo de la merma)'}
                </FieldLabel>
                <Textarea
                  id="note"
                  placeholder={
                    type === 'merma'
                      ? 'Ej. Producto caducado, dañado, derrame, etc.'
                      : 'Ej. Entrada por compra, salida para producción...'
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none border-stone-400 bg-white"
                />
              </Field>
            </FieldSet>
          
            <div className="pt-4">
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || quantity <= 0}
                >
                  {isLoading ? 'Guardando...' : 'Guardar movimiento'}
                </Button>
              </DialogFooter>
            </div>
          </FieldGroup>
        </form>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default DialogEntry;


