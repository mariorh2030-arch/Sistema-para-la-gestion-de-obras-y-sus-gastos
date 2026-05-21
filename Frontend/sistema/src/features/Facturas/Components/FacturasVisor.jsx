import { useState, useEffect } from "react";
import FacturaService from "../Services/FacturasServices";

export default function FacturasVisor({ isOpen, onClose, facturaId, factura }) {
    const [pestañaActiva, setPestañaActiva] = useState(1);
    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && facturaId) {
            cargarArchivos();
        }
    }, [isOpen, facturaId]);

    const cargarArchivos = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5146/api/archivos/${facturaId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setArchivos(data);
            }
        } catch (error) {
            console.error('Error cargando archivos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const normalizeTipo = (archivo) => {
        const tipo = archivo.tipoArchivo?.toLowerCase() ?? '';
        if (tipo === 'jpeg') return 'jpg';
        return tipo;
    };

    const isPdf = (archivo) => {
        const tipo = normalizeTipo(archivo);
        return tipo === 'pdf' || archivo.rutaArchivo?.toLowerCase().endsWith('.pdf');
    };

    const isImage = (archivo) => {
        const tipo = normalizeTipo(archivo);
        return ['jpg', 'png', 'gif', 'webp'].includes(tipo) ||
            ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => archivo.rutaArchivo?.toLowerCase().endsWith(ext));
    };

    const pdf = archivos.find(isPdf);
    const imagen = archivos.find(isImage);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-blue-50">
                    <h1 className="text-2xl font-bold text-gray-800">Visor de Factura</h1>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
                        aria-label="Cerrar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Pestañas */}
                <div className="flex border-b border-gray-200 px-8 bg-white">
                    <button
                        className={`px-4 py-4 font-medium transition ${
                            pestañaActiva === 1
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setPestañaActiva(1)}
                    >
                        Ver PDF
                    </button>

                    <button
                        className={`px-4 py-4 font-medium transition ${
                            pestañaActiva === 2
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setPestañaActiva(2)}
                    >
                        Ver Imagen
                    </button>

                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-auto p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Cargando...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Tab 1: Ver PDF */}
                            {pestañaActiva === 1 && (
                                <div>
                                    {pdf ? (
                                        <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
                                            <iframe
                                                src={`http://localhost:5146${pdf.rutaArchivo}`}
                                                className="w-full h-full"
                                                title="Factura PDF"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500 text-lg">No hay PDF disponible</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab 2: Ver Imagen */}
                            {pestañaActiva === 2 && (
                                <div>
                                    {imagen ? (
                                        <div className="flex justify-center">
                                            <img
                                                src={`http://localhost:5146${imagen.rutaArchivo}`}
                                                alt="Factura Imagen"
                                                className="max-w-full max-h-96 rounded-lg shadow-md"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500 text-lg">No hay imagen disponible</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}