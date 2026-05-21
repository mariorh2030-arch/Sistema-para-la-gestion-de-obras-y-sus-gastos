import { useState, useEffect } from "react";
import CotizacionesForm from "../Components/CotizacionesForm";


export default function Cotizaciones()
{
    const [isOpen, setIsOpen] = useState(false)
    const [pestañaActiva, setPestañaActiva] = useState(1)

    const handleOpenModal = () => setIsOpen(true)

    const handleCloseModal = () =>
    {
        setIsOpen(false)
    }

    return(
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Todas las cotizaciones </h1>
                        <p className="text-gray-500 mt-1">Lista de todas las cotizaciones disponibles</p>
                    </div>

                    <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition "
                    onClick={handleOpenModal}
                    >
                        + Agregar Cotizacion
                </button>
                </div>

                
            </div>

            <CotizacionesForm
                isOpen={isOpen}
                onClose={handleCloseModal}
            >
                <div className="border-b border-gray-200 mb-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setPestañaActiva(1)}
                            className={`pb-3 px-1 font-semibold border-b-2 transition ${
                                pestañaActiva === 1 
                                    ? 'text-blue-600 border-blue-600' 
                                    : 'text-gray-600 border-transparent hover:text-gray-800'
                            }`}
                        >
                            Datos de la cotizacion
                        </button>
                        
                        <button
                            onClick={() => setPestañaActiva(2)}
                            className={`pb-3 px-1 font-semibold border-b-2 transition ${
                                pestañaActiva === 2 
                                    ? 'text-blue-600 border-blue-600' 
                                    : 'text-gray-600 border-transparent hover:text-gray-800'
                            }`}
                        >
                            Archivos adjuntos
                        </button>
                    </div>

                    {pestañaActiva === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Proveedor
                                    </label>
                                    <select 
                                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecciona un proveedor</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Obra
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">Seleccione la obra</option>
                                        </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripcion
                                </label>
                                <textarea 
                                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Detalle lo que se compró o servicio prestado..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Importe
                                    </label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total
                                    </label>
                                    <input 
                                        type="number" 
                                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-2xl transition duration-200 shadow-md"

                                >
                                    Guardar Cotizacion
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </CotizacionesForm>
        </div>
    )
}