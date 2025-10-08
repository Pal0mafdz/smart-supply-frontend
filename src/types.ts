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
    //category: "enlatados" | "congelados" | "secos" | "carnes" | "lacteos" | "frutas"| "verduras"|"especias"| "pescados",  
    category: CategoryProd;
    unit: string,
    quantityInStock: number,
    unitprice: number,
    total: number,
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


