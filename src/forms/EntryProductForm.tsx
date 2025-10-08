
import type { Product } from '@/types'
import { useEffect, useState } from 'react'
import { z } from "zod"
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
//import { Select, SelectContent, SelectGroup,  SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddCategoryProd, useDeleteCategoryProd, useGetCategoriesProd } from '@/api/MyCategoryProdApi';
import { CircleX, Plus } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

    const formSchema = z.object({
        codeNum: z.string().min(1, "El código es requerido"),
        name: z.string().min(1, "El nombre es requerido"),
        category: z.string().min(1, "Selecciona una categoría"),
        unit: z.string().min(1, "La unidad es requerida"),
        quantityInStock: z.coerce.number().min(1, { message: "Debe ser mayor que 0" }),
        unitprice: z.coerce.number().min(0.01, { message: "Debe ser mayor que 0" }),

    });
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
            console.error(err);
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
        unitprice: 0.0,
        }
    });

    const { control, watch } = form;

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

        onSave(formData);
    }


    return (
        
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
            control={control}
            name="codeNum"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />


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
                                <p className='text-sm textå-gray-500 px-2'>C</p>
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
                    {/* <Button type="button" size="icon" onClick={()=> setShowNewCategory((prev)=> !prev)}>
                        <Plus className='w-4 h-4'/>
                        </Button> */}
                        {/* </div> */}
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
                    <Input {...field} />
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
                    <Input type="number" {...field} />
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
                    <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormItem>
            <FormLabel>Total (solo lectura)</FormLabel>
            <FormControl>
                <Input value={total.toFixed(2)} readOnly />
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


