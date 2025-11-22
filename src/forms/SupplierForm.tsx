import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  supplierName: z.string().min(1, "El nombre es requerido"),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: "El formato del correo no es válido" }
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9+\-\s()]{10,}$/.test(val),
      { message: "El formato del teléfono no es válido" }
    ),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/[^\s$.?#].[^\s]*$/.test(val),
      { message: "Debe ser una URL válida" }
    ),
  leadTimeDays: z.coerce.number().min(1, { message: "Debe ser mayor que 0" }),
  minOrderValue: z.coerce.number().min(0.01, { message: "Debe ser mayor que 0" }),
});

type SupplierFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (formData: FormData) => void;
  isLoading?: boolean;
  supplierData?: any;
};

const SupplierForm = ({ supplierData, onSave, isLoading }: Props) => {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierName: "",
      email: "",
      phone: "",
      website: "",
      leadTimeDays: 3,
      minOrderValue: 0,
    },
  });

  // ✅ Si supplierData cambia (modo edición), actualiza los valores del formulario
  useEffect(() => {
    if (supplierData) {
      form.reset({
        supplierName: supplierData.supplierName || "",
        email: supplierData.email || "",
        phone: supplierData.phone || "",
        website: supplierData.website || "",
        leadTimeDays: supplierData.leadTimeDays ?? 3,
        minOrderValue: supplierData.minOrderValue ?? 0,
      });
    } else {
      form.reset({
        supplierName: "",
        email: "",
        phone: "",
        website: "",
        leadTimeDays: 3,
        minOrderValue: 0,
      });
    }
  }, [supplierData, form]);

  const onSubmit = (formDataJson: SupplierFormData) => {
    const formData = new FormData();
    formData.append("supplierName", formDataJson.supplierName);
    formData.append("email", formDataJson.email ?? "");
    formData.append("phone", formDataJson.phone ?? "");
    formData.append("website", formDataJson.website ?? "");
    formData.append("leadTimeDays", formDataJson.leadTimeDays.toString());
    formData.append("minOrderValue", formDataJson.minOrderValue.toString());

    onSave(formData);
  };

  return (
    <>
      <form id="supplier-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="supplierName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field >
                <FieldLabel>Nombre del proveedor</FieldLabel>
                <Input {...field} className= "border-stone-400" placeholder="Ej. Distribuidora MX" autoComplete="off" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}/>
                )}
               
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Correo electrónico</FieldLabel>
                <Input {...field} placeholder="correo@empresa.com" autoComplete="off" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Número telefónico</FieldLabel>
                <Input {...field} placeholder="871 460 2016" autoComplete="off" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="website"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Sitio web</FieldLabel>
                <Input {...field} placeholder="https://proveedor.com" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="leadTimeDays"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tiempo de entrega (días)</FieldLabel>
                <Input {...field} type="number" placeholder="Ej. 3" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="minOrderValue"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Pedido mínimo ($)</FieldLabel>
                <Input {...field} type="number" placeholder="Ej. 500" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <Field orientation="horizontal">
        <Button type="button" onClick={() => form.reset()} disabled={isLoading}>
          Limpiar
        </Button>

        <Button
          type="submit"
          form="supplier-form"
          disabled={isLoading}
          className="flex items-center justify-center"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {supplierData ? "Actualizar" : "Agregar"}
        </Button>
      </Field>
    </>
  );
};

export default SupplierForm;

