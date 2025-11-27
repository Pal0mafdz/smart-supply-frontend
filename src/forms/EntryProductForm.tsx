import type { Product } from '@/types'
import { useEffect, useState } from 'react'
import { z } from "zod"
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm} from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddCategoryProd, useDeleteCategoryProd, useGetCategoriesProd } from '@/api/MyCategoryProdApi';
import { CircleX, Plus } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { toast } from 'sonner';
import { useGetSuppliers } from '@/api/MySupplierApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

    const formSchema = z.object({
        codeNum: z.string().min(1, "El código es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    category: z.string().min(1, "Selecciona una categoría"),
    unit: z.string().min(1, "La unidad es requerida"),
    supplier: z.string().min(1, "Selecciona un proveedor"),
    quantityInStock: z
      .coerce
      .number()
      .refine((v) => !Number.isNaN(v), {
        message: "Debe ser un número válido",
      })
      .min(1, { message: "Debe ser mayor que 0" }),

    unitprice: z
      .coerce
      .number()
      .refine((v) => !Number.isNaN(v), {
        message: "Debe ser un número válido",
      })
      .min(0.01, { message: "Debe ser mayor que 0" }),

    minStock: z
      .coerce
      .number()
      .refine((v) => !Number.isNaN(v), {
        message: "Debe ser un número válido",
      })
      .min(0, { message: "No puede ser negativo" }),

    maxStock: z
      .coerce
      .number()
      .refine((v) => !Number.isNaN(v), {
        message: "Debe ser un número válido",
      })
      .min(0, { message: "No puede ser negativo" }),
  })
  .refine(
    (data) =>
      typeof data.minStock === "number" &&
      typeof data.maxStock === "number" &&
      data.maxStock >= data.minStock,
    {
      path: ["maxStock"],
      message: "El máximo debe ser mayor o igual al mínimo",
    }

  // .refine((data) => data.maxStock >= data.minStock, {
  //   path: ["maxStock"],
  //   message: "El máximo debe ser mayor o igual al mínimo",



  //   }
  );
    type ProductFormData = z.infer<typeof formSchema>

    type Props = {
    product?: Product;
    onSave: (productFormData: FormData) => void;
    isLoading: boolean;
    }

    const EntryProductForm = ({ onSave, isLoading, product }: Props) => {
    const [total, setTotal] = useState(0);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");

    const {addCategoryProd, isLoading: isAdding} = useAddCategoryProd();
    const {categories, isLoading: isLoadingCategories} = useGetCategoriesProd();
    const {deleteCategoryProd } = useDeleteCategoryProd();
    const [searchValue, setSearchValue] = useState("");
    const { suppliers, isLoading: isLoadingSuppliers } = useGetSuppliers();
    // const [supplierSearchValue, setSupplierSearchValue] = useState("");

    const handleAddCategory = async () =>{
        if(!newCategory.trim()) return;

        try{
           const newCat = await addCategoryProd({name: newCategory});
            setNewCategory(""),
            setShowNewCategory(false);
            setNewCategory("");
            setShowNewCategory(false);
            form.setValue("category", newCat._id);
            setSearchValue(newCat.name);
           // form.reset();

        }catch(err){
            console.error(err);
        }
    }

    const handleDeleteCategory = async(categoryid: string) => {
        try{
            await deleteCategoryProd(categoryid);
            if (categoryid === watch("category")) {
                form.setValue("category", "");
                setSearchValue("");
              }
            //form.reset();
        }catch(err){
            toast.error("Tienes Productos registrados con la categoria a eliminar", {position: "top-center"});

        }
        


    }

    const form = useForm<ProductFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        codeNum: "",
        name: "",
        category: "",
        unit: "",
        quantityInStock: 0,
        unitprice: 0.00,
        minStock: 0,
        maxStock: 0,
        },
        mode: "onChange",      
    });

    const { control, watch, formState: {errors} } = form;

    // Actualizamos total cuando cambian quantityInStock o unitprice
    const quantity = watch("quantityInStock");
    const price = watch("unitprice");

    useEffect(() => {
        setTotal(quantity * price);
    }, [quantity, price]);

    useEffect(() => {
        if (product) {
        form.reset({
            codeNum: product.codeNum,
            name: product.name,
            category: product.category._id,
            unit: product.unit,
            quantityInStock: product.quantityInStock,
            unitprice: product.unitprice,
            minStock: product.minStock ?? 0,
            maxStock: product.maxStock ?? 0,
        });
        setTotal(product.quantityInStock * product.unitprice);
        setSearchValue(product.category.name);
        }
    }, [product, form]);

    const onSubmit = (formDataJson: ProductFormData) => {
        const formData = new FormData();
        formData.append("codeNum", formDataJson.codeNum);
        formData.append("name", formDataJson.name);
        formData.append("category", formDataJson.category);
        formData.append("unit", formDataJson.unit);
        formData.append("quantityInStock", formDataJson.quantityInStock.toString());
        formData.append("unitprice", formDataJson.unitprice.toString());
        formData.append("minStock", formDataJson.minStock.toString());
        formData.append("maxStock", formDataJson.maxStock.toString());
        formData.append("supplier", formDataJson.supplier);

        onSave(formData);
    }


    return (
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
            control={form.control}
            name="codeNum"
            render={({ field}) => (
                <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                    <Input {...field} className='bg-white border-stone-400'/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                    <Input {...field} className='bg-white border-stone-400'/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

<FormField
  control={control}
  name="supplier"
  render={({ field }) => (
    <FormItem className="mt-4">
      <FormLabel>Proveedor</FormLabel>
      <FormControl>
        <Select
          onValueChange={field.onChange}
          value={field.value}
        >
          <SelectTrigger className="bg-white border-stone-400">
            <SelectValue placeholder="Selecciona un proveedor" />
          </SelectTrigger>

          <SelectContent>
            {isLoadingSuppliers && (
              <p className="px-2 text-sm text-gray-500">Cargando...</p>
            )}

            {suppliers?.map((sup) => (
              <SelectItem key={sup._id} value={sup._id ?? ""}>
                {sup.supplierName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* 
<FormField
  control={control}
  name="supplier"
  render={({ field }) => (
    <FormItem className="mt-4">
      <FormLabel>Proveedor</FormLabel>

      <FormControl>
        <Command>
          <CommandInput
            placeholder="Busca o selecciona un proveedor"
            value={supplierSearchValue}
            onValueChange={setSupplierSearchValue}
          />

          <CommandList>
            {isLoadingSuppliers && (
              <p className="px-2 text-sm text-gray-500">Cargando...</p>
            )}

            <CommandGroup>
              {suppliers?.map((sup) => (
                <CommandItem
                  key={sup._id}
                  value={sup._id}
                  onSelect={() => {
                    field.onChange(sup._id);
                    setSupplierSearchValue(sup.supplierName);
                  }}
                >
                  {sup.supplierName}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandEmpty>No hay proveedores</CommandEmpty>
          </CommandList>
        </Command>
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/> */}



            <FormField control={control} name="category" render={({field})=>(
                <FormItem>
                   <div className="flex items-center justify-between">
                        <FormLabel className="mb-0">Categoría</FormLabel>
                        <div className='justify-right'>
                        <Button type="button" size="icon"
                            onClick={() => setShowNewCategory(prev => !prev)}
                            className="ml-2">
                            <Plus className='w-4 h-4'/>
                        </Button>
                        </div>
                    </div>

                   <FormControl>

                    <Command>
                        <CommandInput placeholder='Busca o selecciona una categoria'
                        value={searchValue}
                        onValueChange={setSearchValue}/>
                        <CommandList>
                            {isLoadingCategories && (
                                <p className='text-sm textå-gray-500 px-2 '>C</p>
                            )}
                            <CommandGroup>
                                {categories?.map((cat)=> (
                                    <CommandItem key={cat._id} value={cat._id} 
                                    onSelect={()=> {
                                     field.onChange(cat._id);
                                     setSearchValue(cat.name);
                                    }}
                                    className='flex justify-between items-center'>
                                        {cat.name}
                                        <button type='button' onClick={(e)=> {
                                            e.stopPropagation();
                                            handleDeleteCategory(cat._id);
                                        }}>
                                            <CircleX className='w-4 h-4 text-red-500'/>
                                        </button>

                                    </CommandItem>
                                ))}

                            </CommandGroup>
                            <CommandEmpty>No hay Categorias</CommandEmpty>
                        </CommandList>
                    </Command>


        
                    </FormControl>
                   
                    <FormMessage/>
                </FormItem>)}/>

                {showNewCategory && (
                    <div className='flex items-center gap-2 mt-2'>
                        <Input placeholder='Nueva categoria' value={newCategory} onChange={(e)=> setNewCategory(e.target.value)}/>
                        <Button onClick={handleAddCategory} disabled={isAdding} type='button'>Agregar</Button>

                    </div>
                )}

            <FormField
            control={control}
            name="unit"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Unidad</FormLabel>
                <FormControl>
                    <Input {...field} className='bg-white border-stone-400' 
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={control}
            name="quantityInStock"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                    <Input type="number" {...field} className={cn(
            "bg-white border-stone-400",
            errors.quantityInStock && "border-red-500 focus-visible:ring-red-500"
          )}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={control}
            name="unitprice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Precio unitario</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" {...field} className={cn(
            "bg-white border-stone-400",
            errors.quantityInStock && "border-red-500 focus-visible:ring-red-500"
          )} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />


<div className='flex gap-4'>
<FormField
  control={control}
  name="minStock"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Mínimo en almacén</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          className={cn(
            "bg-white border-stone-400",
            errors.minStock && "border-red-500 focus-visible:ring-red-500"
          )}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={control}
  name="maxStock"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Máximo en almacén</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          className={cn(
            "bg-white border-stone-400",
            errors.maxStock && "border-red-500 focus-visible:ring-red-500"
          )}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
</div>




            <FormItem>
            <FormLabel>Total (solo lectura)</FormLabel>
            <FormControl>
                <Input value={total.toFixed(2)} readOnly className='bg-white border-stone-400'/>
            </FormControl>
            </FormItem>

            <Button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded"
            >
            Guardar
            </Button>
        </form>
        </Form>
        
    )
    }

export default EntryProductForm;



