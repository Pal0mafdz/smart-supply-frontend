export type User = {
    _id: string,
    name: string,
    email: string,
    role: "admin" | "jefe de cocina" | "contador" | "mesero" | "almacenista" | "gerente" | "unauthorized", 
}