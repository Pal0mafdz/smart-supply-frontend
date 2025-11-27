

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

const InventoryNav = () => {
  const location = useLocation();

  const items = [
    { title: "Inventario", url: "/inventory" },
    { title: "Historial", url: "/movements-inventory" },
    { title: "Proveedores", url: "/suppliers" },
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isCurrent = location.pathname === item.url;

          return (
            <React.Fragment key={item.url}>
              <BreadcrumbItem>
                {isCurrent ? (
                  // Página actual: no es link, solo texto marcado
                  <BreadcrumbLink
                    aria-current="page"
                    className="font-semibold text-foreground pointer-events-none"
                  >
                    {item.title}
                  </BreadcrumbLink>
                ) : (
                  // Breadcrumb de niveles anteriores: sí son links
                  <BreadcrumbLink asChild>
                    <Link to={item.url}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default InventoryNav;
