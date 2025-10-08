import { useEditProduct } from '@/api/MyProductApi';
import type { Product } from '@/types';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { useState } from 'react';
import { DialogFooter, DialogHeader } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field';
import { Textarea } from './ui/textarea';


type Props = {
    product: Product;
    open: boolean;
    onClose: () => void;
}

const DialogEntry = ({product, open, onClose}: Props) => {
    const [quantityInStock, setQuantityInStock] = useState(product.quantityInStock);
    const [unitprice, setUnitprice] = useState(product.unitprice);
    const [note, setNote] = useState("");
    const {editProduct, isLoading} = useEditProduct();

    const handleSave = async() => {
        await editProduct({
            productId: product._id,
            updates: {quantityInStock, unitprice, note},
        })
        onClose();
    };


  return (
    <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Editar producto</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Datos del producto</FieldLegend>
            <FieldDescription>
              Modifica los valores y deja una nota del cambio.
            </FieldDescription>

            <Field>
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <Input id="name" value={product.name} disabled />
            </Field>

            <Field>
              <FieldLabel htmlFor="quantity">Cantidad en stock</FieldLabel>
              <Input
                id="quantity"
                type="number"
                value={quantityInStock}
                onChange={(e) => setQuantityInStock(Number(e.target.value))}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="price">Precio unitario</FieldLabel>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={unitprice}
                onChange={(e) => setUnitprice(Number(e.target.value))}
              />
              <FieldDescription>
                Si solo cambias el precio, el movimiento se registrará como <b>ajuste</b>.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="note">Nota</FieldLabel>
              <Textarea
                id="note"
                placeholder="Ej. Ajuste de precio por cambio de proveedor"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none"
              />
            </Field>
          </FieldSet>

          <div className="pt-4">
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </div>
        </FieldGroup>
      </form>
    </DialogContent>
  </Dialog>
  )
}

export default DialogEntry