import { useGetProducts } from "@/api/MyProductApi";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import ImageAspect from "./ImageAspect";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";

import { cn } from "@/lib/utils";

const formSchema = z.object({
  recipename: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  typeOR: z.enum(["Desayunos","Entradas", "Platos fuertes", "Postres"]),
  products: z.array(
    z.object({
      productId: z.string().min(1, "Selecciona un producto"),
      quantity: z.coerce.number().min(0.01, "Debe ser mayor que 0"),
    })
  ),
  imageFile: z.any().refine((file) => file?.length > 0 , "La imagen es requerida"),
});

const editImage = formSchema.extend({
  imageFile: z.any().optional(),
})

type RecipeFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (formData: FormData) => void;
  isLoading?: boolean;
  recipeData?: any;
};

const RecipeForm = ({ onSave, isLoading, recipeData }: Props) => {
  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeData ? editImage : formSchema),
    mode: "onSubmit",
    defaultValues: {
      recipename: "",
      description: "",
      typeOR: "Desayunos",
      products: [{ productId: "", quantity: 0 }],
      
    },
  });

  const { control, watch, setValue, reset } = form;
  const { products: inventoryProducts } = useGetProducts();

  const [searchValue, setSearchValue] = useState<string[]>([]);
  const [calculatedCosts, setCalculatedCosts] = useState<number[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  const watchedProducts = watch("products");

  useEffect(() => {

    if(!inventoryProducts || !recipeData) return;

    reset({
      recipename: recipeData.recipename,
      description: recipeData.description,
      typeOR: recipeData.typeOR,
      products: recipeData.products.map((p: any) => ({
        productId: p.product._id,
        quantity: p.quantity,
      })),
    });

    const costs = recipeData.products.map((p: any) => p.product.unitprice * p.quantity);
    setCalculatedCosts(costs);
    setTotalCost(costs.reduce((a: any, b: any) => a + b, 0));

    setSearchValue(recipeData.products.map((p: any) => p.product.name));
    
    
  }, [recipeData, inventoryProducts, reset]);
  

  useEffect(() => {
    if (!inventoryProducts) return;

    let total = 0;
    const costs = watchedProducts.map((p) => {
      const prod = inventoryProducts.find((x) => x._id === p.productId);
      if (!prod) return 0;

      const cost = prod.unitprice * (p.quantity || 0);
      total += cost;
      return cost;
    });

    setCalculatedCosts(costs);
    setTotalCost(total);
  }, [watchedProducts, inventoryProducts]);


  const onSubmit = async (formDataJson: RecipeFormData) => {
    // console.log('Hola que hace ' )
    const formData = new FormData();
    formData.append("recipename", formDataJson.recipename);
    formData.append("description", formDataJson.description);
    formData.append("typeOR", formDataJson.typeOR); 
    formData.append("products", JSON.stringify(formDataJson.products));
    if (formDataJson.imageFile?.[0]) {
      formData.append("image", formDataJson.imageFile[0]);
    }
    onSave(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

    <FormField 
        control={control}
        name="typeOR"
        render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormLabel className="whitespace-nowrap">Tipo de Receta</FormLabel>
            <FormControl className="flex-1">
              <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Desayunos">Desayunos</SelectItem>
                  <SelectItem value="Entradas">Entradas</SelectItem>
                  <SelectItem value="Platos fuertes">Platos fuertes</SelectItem>
                  <SelectItem value="Postres">Postres</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
              )}
            />

          <FormField
          control={control}
          name="recipename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la receta</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Ensalada de Pollo" 
                className={cn("border bg-white",
                  form.formState.errors.recipename && "!border-red-500"
                )}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />




        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Describe tu receta..." 
                className={cn("bg-white",
                  form.formState.errors.recipename && "border-red-500 focus-visible:ring-red-500"
                )}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Controller
          control={control}
          name="products"
          render={({ field }) => (
            <div className="space-y-3">
              {field.value.map((product, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Command className="w-52">
                    <CommandInput
                      placeholder="Selecciona un producto"
                      value={searchValue[index] || ""}
                      onValueChange={(val) => {
                        const newSearch = [...searchValue];
                        newSearch[index] = val;
                        setSearchValue(newSearch);
                      }}
                      className={cn(
                        form.formState.errors.products?.[index]?.productId && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <CommandList>
                      <CommandEmpty>No hay productos</CommandEmpty>
                      <CommandGroup>
                        {inventoryProducts?.map((prod) => (
                          <CommandItem
                            key={prod._id}
                            value={prod._id}
                            onSelect={() => {
                              const newProducts = [...field.value];
                              newProducts[index].productId = prod._id;
                              field.onChange(newProducts);

                              const newSearch = [...searchValue];
                              newSearch[index] = prod.name;
                              setSearchValue(newSearch);
                            }}
                          >
                            {prod.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>


                  <Input
                    type="number"
                    className={cn(
                      "w-24 bg-white",
                      form.formState.errors.products?.[index]?.quantity && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="Cantidad"
                    value={product.quantity}
                    onChange={(e) => {
                      const newProducts = [...field.value];
                      newProducts[index].quantity = parseFloat(e.target.value);
                      field.onChange(newProducts);
                    }}

                    
                  />

                  <span className="w-24 text-sm text-gray-700">
                    ${calculatedCosts[index]?.toFixed(2) || "0.00"}
                  </span>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      const newProducts = field.value.filter((_, i) => i !== index);
                      field.onChange(newProducts);
                      setSearchValue(searchValue.filter((_, i) => i !== index));
                    }}
                  >
                    <CircleX className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}


              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  field.onChange([...field.value, { productId: "", quantity: 0 }])
                }
                className="bg-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Agregar ingrediente
              </Button>
            </div>
          )}
        />

            <FormField
              control={control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen de la receta</FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "p-2 rounded-md",
                        form.formState.errors.imageFile && "border border-red-500"
                      )}
                    >
                      <ImageAspect
                        onChange={(file) => field.onChange(file ? [file] : [])}
                        value={field.value?.[0] || null}
                        existingImageUrl={recipeData?.imageUrl}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />



        <div className="flex justify-end text-lg font-semibold">
                Total: ${totalCost.toFixed(2)}
        </div>


            <Button type="submit" disabled={isLoading} className="w-full bg-stone-900 text-stone-300">
      {isLoading ? "Guardando..." : "Guardar"}
    </Button>
          </form>
        </Form>
  );
};

export default RecipeForm;

