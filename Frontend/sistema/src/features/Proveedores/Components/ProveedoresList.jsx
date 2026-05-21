export default function ProveedoresList({proveedores, onEdit, onDelete})
{
    return(
        <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Nombre proveedor</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">RFC:</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {proveedores.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">No hay proveedores registrados </td>
                            </tr>
                        ) : (
                            proveedores.map((proveedor) => (
                                <tr key={proveedor.id}>
                                    <td className="px-4 py-4">{proveedor.nombreP}</td>
                                    <td className="px-4 py-4">{proveedor.rfc}</td>
                                    <td className="px-4 py-4">
                                        <button onClick={() => onDelete(proveedor.id)}>
                                            <img src="/public/btn_eliminar.png" alt="btn_eliminar" /> 
                                        </button>
                                        <button onClick={() => onEdit(proveedor)}>
                                            <img src="/public/btn_editar.png" alt="btn_editar" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}