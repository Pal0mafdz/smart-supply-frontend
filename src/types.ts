export type User = {
    _id: string,
    name: string,
    email: string,
    role: "admin" | "jefe de cocina" | "contador" | "mesero" | "almacenista" | "gerente" | "unauthorized", 
}

export type Product = {
    _id: string,
    codeNum: string,
    name: string,
    category: CategoryProd;
    unit: string,
    quantityInStock: number,
    unitprice: number,
    total: number,
    date: Date,

}

export type CategoryProd = {
    _id: string,
    name: string,
}


export type Movement = {
    _id: string,
    product: Product,
    type: "entrada" | "salida" | "ajuste",
    quantity: number,
    prevQuantity: number,
    newQuantity: number,
    note: string,
    user: User,
    date: Date,

}


export type RecipeProduct = {
    product: Product;   // objeto populado desde el back
    quantity: number;
    cost?: number;
  };
  
  export type Recipe = {
    _id?: string;
    recipename: string;
    products: RecipeProduct[];  
    totalCost: number;
    description: string;
    imageUrl: string;
    typeOR: "Desayunos" |"Entradas" | "Platos Fuertes" | "Postres" | "Todos";
    createdAt: Date;
  };

  export type Dish = {
    _id?: string;
    recipeId: string;       
    name: string;           
    quantity: number;
    note?: string;
    subtotal: number;       
    totalCost: number;      
  };

  export type Order = {
    _id?: string;
    number: number;
    dishes: Dish[];
    status: "recibido" | "en preparacion" | "listo para servir" | "entregado" | "pagado";
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
  };

  export type Table = {
    status: any;
    _id?: string;
    number: number;
    waiterId: string;     
    state: "abierta" | "cerrada" | "reservada" | "disponible" ;
    area: "Terraza" | "Area Principal";
    order: string;     
    openedAt?: Date;
    closedAt?: Date;
    capacity: number; //la capacidad es de cuantos asientos es
    customers: number;

  };

  export type Supplier = {
    _id?: string;
    supplierName: string;
    email?: string;
    phone?: string;
    website: string;
    leadTimeDays: number;  // tiempo de entrega
    minOrderValue: number; // mínimo por compra
  }