

export default function FacturasList({facturas, onEdit, onDelete, onView})
{
    return(
        <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                <table className="w-full min-w-[1200px]">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Acciones</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Nombre proveedor</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Fecha de emision</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Folio fiscal</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Obra</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Metodo de pago</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 w-48">Descripcion</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Importe</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Iva</th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-500">
                        {facturas.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                                    No hay facturas registradas
                                </td>
                            </tr>
                        ) : (
                            facturas.map((factura) => (
                                <tr key={factura.id} className="hover:bg-gray-50 transition">
                                     <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => onView(factura)}
                                                title="Ver factura"
                                                className="p-1 hover:bg-blue-100 rounded transition"
                                            >
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => onEdit(factura)}
                                                title="Editar factura"
                                                className="p-1 hover:bg-yellow-100 rounded transition"
                                            >
                                                <img src="/public/btn_editar.png" alt="btn_editar" className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(factura.id)}
                                                title="Eliminar factura"
                                                className="p-1 hover:bg-red-100 rounded transition"
                                            >
                                                <img src="/public/btn_eliminar.png" alt="btn_eliminar" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 max-w-auto truncate">{factura.nombreProveedor || 'Sin proveedor'}</td>
                                    <td className="px-4 py-4 max-w-auto truncate">{factura.fechaEmision?.split('T')[0]}</td>
                                    <td className="px-4 py-4 max-w-auto truncate">{factura.folioFiscal}</td>
                                    <td className="px-4 py-4 max-w-auto truncate">{factura.nombreObra || 'Sin obra'}</td>
                                    <td className="px-4 py-4 max-w-auto truncate">{factura.tipoPago || 'Sin método'}</td>
                                    <td className="px-4 py-4 max-w-auto truncate">
                                        {factura.descripcion}
                                    </td>
                                    <td className="px-4 py-4 max-w-auto truncate">${Number(factura.importe || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 max-w-auto truncate">${Number(factura.montoIva || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-4 max-w-auto truncate">${Number(factura.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}