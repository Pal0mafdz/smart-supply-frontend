import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
// import React from "react";

// const items = [
//   {
//     title: "Historial",
//     url: "/movements-inventory",
//   },
//   // {
//   //   title: "Entradas",
//   //   url: "/entries-inventory",
//   // },
//   // {
//   //   title: "Salidas",
//   //   url: "/exits-inventory",
//   // },
// ];

const InventoryNav = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/inventory">Inventario</Link>
          </BreadcrumbLink>

        </BreadcrumbItem>
        <BreadcrumbSeparator/>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/movements-inventory">Historial</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    

    
    </Breadcrumb>
  );
};

export default InventoryNav;
