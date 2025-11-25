
import { useGetLowStockSupplierRecommendations } from "@/api/MyProductApi";

const LowStockSupplierAI = () => {
  const { data, isLoading, error } = useGetLowStockSupplierRecommendations();

  if (isLoading) return <p className="text-white">Cargando recomendaciones IA...</p>;
  if (error) return <p className="text-red-500">Error al cargar recomendaciones.</p>;

  return (
    <div className="space-y-6 mt-4">
      {data?.items.map((item) => (
        <div
          key={item.productId}
          className="border border-gray-600 rounded-lg p-4 bg-gray-900 shadow-md"
        >
          <h2 className="text-xl font-bold text-white">
            {item.productName}
          </h2>

          <p className="text-gray-300">
            Stock actual:
            <span className="ml-1 text-yellow-400">
              {item.quantityInStock}/{item.minStock}
            </span>
          </p>

          <p className="text-gray-400">
            Proveedor actual:{" "}
            <span className="text-blue-300">
              {item.currentSupplier ?? "No definido"}
            </span>
          </p>

          <h3 className="text-lg font-semibold mt-3 text-green-400">
            🔮 Recomendaciones IA
          </h3>

          <ul className="space-y-2 mt-2">
            {item.recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="p-3 rounded bg-gray-800 border border-gray-700"
              >
                <p className="text-white font-semibold">{rec.supplierName}</p>

                {rec.website && (
                  <a
                    href={rec.website}
                    target="_blank"
                    className="text-blue-400 underline text-sm"
                  >
                    {rec.website}
                  </a>
                )}

                {rec.relativePriceComment && (
                  <p className="text-gray-400 text-sm">
                    Precio:{" "}
                    <span className="text-yellow-300">
                      {rec.relativePriceComment}
                    </span>
                  </p>
                )}

                {rec.notes && (
                  <p className="text-gray-400 text-sm mt-1">
                    {rec.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LowStockSupplierAI;
