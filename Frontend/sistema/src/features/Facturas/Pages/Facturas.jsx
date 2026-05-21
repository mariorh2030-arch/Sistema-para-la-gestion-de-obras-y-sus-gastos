import { useState, useEffect } from "react";
import FacturasForm from "../Components/FacturasForm";
import FacturaService from "../Services/FacturasServices";
import FacturasList from "../Components/FacturasList";
import FacturasVisor from "../Components/FacturasVisor";
import ProveedorService from "../../Proveedores/Services/ProveedoresServices";
import ObraService from "../../Obras/Services/ObrasServices";


export default function Facturas()
{
    const [isOpen, setIsOpen] = useState(false)
    const [isViewerOpen,
         setIsViewerOpen] = useState(false)
    const [listaFactura, setListaFactura] = useState([])
    const [modeEdit, setModeEdit] = useState(false)
    const [idEdited, setIdEdited] = useState(null)
    const [proveedores, setProveedores] = useState([])
    const [ivas, setIvas] = useState([])
    const [pagos, setPagos] = useState([])
    const [obras, setObras] = useState([])
    const [obrasfiltradas, setObrasFiltradas] = useState('')
    const [resumen, setResumen] = useState(null)
    const [gastosObras, setGastosObras] = useState([])
    const [gastosTasa, setGastosTasa] = useState([])
    const [pestañaActiva, setPestañaActiva] = useState(1)
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1)
    const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear())
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null)
    const facturasFiltradas = listaFactura
    .filter( f => {
        const fecha = new Date(f.fechaEmision)
        return fecha.getMonth() + 1 === Number(mesSeleccionado) && fecha.getFullYear() === Number(añoSeleccionado)
    })
    .filter(f => obrasfiltradas ? f.obraId === Number(obrasfiltradas) : true)

    const total16 = Number(gastosTasa.find(item => Number(item.tasaIva) === 16)?.totalGastos ?? 0)
    const total8 = Number(gastosTasa.find(item => Number(item.tasaIva) === 8)?.totalGastos ?? 0)

    const [factura, setFactura] = useState({
        FechaEmision: '',
        FolioFiscal: '',
        Descripcion: '',
        Importe: '',
        Iva: '',
        Total: '',
        TipoIvaId: '',
        ProveedorId: '',
        TipoPagoId: '',
        ObraId: ''
    })
    const [pdfFile, setPdfFile] = useState(null)
    const [comprobanteFile, setComprobanteFile] = useState(null)


    const handleOpenModal = () => setIsOpen(true)
    const handleCloseModal = () => {
        setIsOpen(false)
        setModeEdit(false)
        setIdEdited(null)
        setPdfFile(null)
        setComprobanteFile(null)
        setFactura({
            FechaEmision: '',
            FolioFiscal: '',
            Descripcion: '',
            Importe: '',
            Iva: '',
            Total: '',
            TipoIvaId: '',
            ProveedorId: '',
            TipoPagoId: '',
            ObraId: ''
        })
    }
    const CargarFacturas = async () =>{
        const data = await FacturaService.getAll()
        setListaFactura(data)
    }

    const CargarProveedores = async () => {
        try {
            const data = await ProveedorService.getAll()
            setProveedores(data)
        } catch (error) {
            console.error('Error cargando proveedores:', error)
        }
    }

    const CargarIvas = async () => {
        try {
            const data = await FacturaService.getIvas()
            setIvas(data)
        } catch (error) {
            console.error('Error cargando ivas:', error)
        }
    }
    const CargarPagos = async () => {
        try {
            const data = await FacturaService.getPayMethods()
            setPagos(data)
        } catch (error) {
            console.error('Error cargando pagos:', error)
        }
    }
    const CargarObras = async () => {
        try {
            const data = await ObraService.getAll()
            setObras(data)
        } catch (error) {
            console.error('Error cargando obras:', error)
        }
    }
    const CargarResumen = async () => {
        const data = await FacturaService.getResumenMes(mesSeleccionado, añoSeleccionado)
        setResumen(data)
    }

    const CargarGastosObras = async () =>{
        const data = await FacturaService.getGastosObras(mesSeleccionado, añoSeleccionado)
        setGastosObras(data)
    }

    const CargarGastosTasa = async () => {
        const data = await FacturaService.getGastosTasa(mesSeleccionado, añoSeleccionado)
        setGastosTasa(data)
    }

    useEffect(() => {
        CargarResumen()
        CargarGastosObras()
        CargarGastosTasa()
    }, [mesSeleccionado, añoSeleccionado])

    useEffect(() => {
        CargarProveedores()
        CargarIvas()
        CargarPagos()
        CargarObras()
        CargarFacturas()
    }, [])

    const handleChange = (e) => {
    const { name, value } = e.target
    const updatedFactura = { ...factura, [name]: value }

    // Recalcular cuando cambia Importe o TipoIvaId
    const importe = parseFloat(name === 'Importe' ? value : updatedFactura.Importe) || 0
    const ivaSeleccionado = ivas.find(i => i.id === parseInt(
        name === 'TipoIvaId' ? value : updatedFactura.TipoIvaId
    ))

    if (importe > 0 && ivaSeleccionado) {
        const montoIva = importe * ivaSeleccionado.tipoIva / 100
        updatedFactura.Iva = montoIva.toFixed(2)
        updatedFactura.Total = (importe + montoIva).toFixed(2)
    } else {
        updatedFactura.Iva = ''
        updatedFactura.Total = ''
    }

    setFactura(updatedFactura)
}

    const handleSubmit = async () => {
        console.log('Datos a enviar:', factura)
        try {
            const facturaPayload = {
                FechaEmision: factura.FechaEmision,
                FolioFiscal: factura.FolioFiscal,
                Descripcion: factura.Descripcion,
                Importe: Number(factura.Importe),
                TipoIvaId: Number(factura.TipoIvaId),
                ProveedorId: Number(factura.ProveedorId),
                ObraId: Number(factura.ObraId),
                TipoPagoId: Number(factura.TipoPagoId)
            }

            if (!facturaPayload.FechaEmision || !facturaPayload.FolioFiscal || !facturaPayload.Descripcion ||
                Number.isNaN(facturaPayload.Importe) || facturaPayload.Importe <= 0 ||
                facturaPayload.TipoIvaId <= 0 || facturaPayload.ProveedorId <= 0 ||
                facturaPayload.ObraId <= 0 || facturaPayload.TipoPagoId <= 0) {
                throw new Error('Complete todos los campos obligatorios correctamente antes de guardar.');
            }

            let facturaId = idEdited

            if (modeEdit) {
                await FacturaService.update(idEdited, facturaPayload)
            } else {
                const createdFactura = await FacturaService.create(facturaPayload)
                facturaId = createdFactura?.id
            }

            if (pdfFile && facturaId) {
                await FacturaService.UploadFile(facturaId, pdfFile, 'pdf')
            }

            if (comprobanteFile && facturaId) {
                await FacturaService.UploadFile(facturaId, comprobanteFile, 'comprobante')
            }

            CargarResumen()
            CargarGastosObras()
            CargarGastosTasa()
            CargarFacturas()
            setIsOpen(false)
            setModeEdit(false)
            setIdEdited(null)
            setPdfFile(null)
            setComprobanteFile(null)
            setFactura({
                FechaEmision: '',
                FolioFiscal: '',
                Descripcion: '',
                Importe: '',
                Iva: '',
                Total: '',
                TipoIvaId: '',
                ProveedorId: '',
                TipoPagoId: '',
                ObraId: ''
            })
        } catch (error) {
            alert('Error al guardar la factura: ' + error.message)
            console.error(error)
        }
    }
    const handleEdit = (factura) =>
    {
        setFactura({
            FechaEmision: factura.fechaEmision?.split('T')[0] ?? '',
            FolioFiscal: factura.folioFiscal ?? '',
            Descripcion: factura.descripcion ?? '',
            Importe: factura.importe ?? '',
            Iva: factura.montoIva ?? '',
            Total: factura.total ?? '',
            TipoIvaId: factura.tipoIvaId ?? '',
            ProveedorId: factura.proveedorId ?? '',
            TipoPagoId: factura.tipoPagoId ?? '',
            ObraId: factura.obraId ?? ''
        })


        setModeEdit(true)
        setIdEdited(factura.id)
        setPdfFile(null)
        setComprobanteFile(null)
        setIsOpen(true)
    }

    const handleDelete = async (id) => {
        if(!confirm('¿Desea eliminar esta factura?'))
            return 
        await FacturaService.delete(id)
        CargarGastosObras()
        CargarGastosTasa()
        CargarResumen()
        CargarFacturas()
    }

    const handleViewFactura = (factura) => {
        setFacturaSeleccionada(factura)
        setIsViewerOpen(true)
    }

    const handleCloseViewer = () => {
        setIsViewerOpen(false)
        setFacturaSeleccionada(null)
    }

    return(
<div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Todas las Facturas</h1>
                <p className="text-gray-500 mt-1">Gestión de gastos de la empresa</p>
            </div>
            <button 
                onClick={handleOpenModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition"
            >
                + Nueva Factura
            </button>
        </div>

        {/* Modal para agregar o editar una factura */}
            <FacturasForm 
                isOpen={isOpen}
                onClose={handleCloseModal}
                modoEditar={modeEdit}
                idEditando={idEdited}
                title={modeEdit ? "Editar Factura": "Agregar Factura"}
            >
                {/* Tabs */}
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
                            Datos de Factura
                        </button>

                        <button
                            onClick={() => setPestañaActiva(2)}
                            className={`pb-3 px-1 font-semibold border-b-2 transition ${
                                pestañaActiva === 2 
                                    ? 'text-blue-600 border-blue-600' 
                                    : 'text-gray-600 border-transparent hover:text-gray-800'
                            }`}
                        >
                            Archivos
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {pestañaActiva === 1 && (
                    <div className="space-y-6">
                        {/* Primera fila - 2 columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Proveedor
                                </label>
                                <select 
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                name="ProveedorId"
                                value={factura.ProveedorId}
                                onChange={handleChange}
                                >
                                <option value="">Seleccione un proveedor </option>
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor.id} value={String(proveedor.id)}>
                                        {proveedor.nombreP}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha de Emisión
                            </label>
                            <input 
                                type="date" 
                                name="FechaEmision"
                                value={factura.FechaEmision}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {/* Segunda fila */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Folio Fiscal
                            </label>
                            <input 
                                type="text" 
                                name="FolioFiscal"
                                value={factura.FolioFiscal}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: C9420B71"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Obra
                            </label>
                            <select 
                            name="ObraId"
                            value={factura.ObraId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Seleccione la obra </option>
                            {obras.map((obra) => (
                                <option key={obra.id} value={String(obra.id)}>
                                    {obra.nombreObra}
                                </option>
                            ))}
                        </select>
                        </div>
                    </div>

                    {/* Descripción - ocupa todo el ancho */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea 
                            rows={4}
                            name="Descripcion"
                            value={factura.Descripcion}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Detalle lo que se compró o servicio prestado..."
                        />
                    </div>
                    {/* Tipo de Iva */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de iva
                        </label>
                        <select 
                        name="TipoIvaId"
                        value={factura.TipoIvaId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Seleccione el tipo de iva</option>
                            {ivas.map((iva) => (
                                <option key={iva.id} value={String(iva.id)}>
                                    {iva.tipoIva}%
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fila de Importe, IVA y Total */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Importe
                            </label>
                            <input 
                                type="number" 
                                name="Importe"
                                value={factura.Importe}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                IVA
                            </label>
                            <input 
                                type="text" 
                                name="Iva"
                                value={factura.Iva}
                                readOnly
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 text-gray-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 ">
                                Total
                            </label>
                            <input 
                                type="text" 
                                name="Total"
                                value={factura.Total}
                                readOnly
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 font-semibold text-lg"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Tipo de Pago */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Método de Pago
                        </label>
                        <select 
                            name="TipoPagoId"
                            value={factura.TipoPagoId}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione método de pago</option>
                            {pagos.map((tipo) => (
                                <option key={tipo.id} value={String(tipo.id)}>
                                    {tipo.tipoPago}
                                </option>
                            ))}
                        </select>
                    </div>

                
                </div>
                )}

                {pestañaActiva === 2 && (
                    <div className="space-y-6">
                        {/* Primera fila - 2 columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Factura XML
                                </label>
                                <input 
                                    type="file"
                                    accept=".xml"
                                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Factura PDF
                                </label>
                                <input 
                                    type="file"
                                    accept=".pdf"
                                    onChange={ e => setPdfFile(e.target.files[0] || null) }
                                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                                {pdfFile && (
                                    <p className="text-sm text-gray-500 mt-2">Archivo listo para subir: {pdfFile.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Segunda fila - 1 columna */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comprobante de Pago
                            </label>
                            <input 
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={ e => setComprobanteFile(e.target.files[0] || null) }
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            {comprobanteFile && (
                                <p className="text-sm text-gray-500 mt-2">Comprobante listo para subir: {comprobanteFile.name}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Botón Guardar */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-2xl transition duration-200 shadow-md"
                    >
                        {modeEdit ? "Editar Factura" : "Guardar Factura"}
                    </button>
                </div>
            </FacturasForm>

        {/* Filtros */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">Mes</label>
                    <select 
                        value={mesSeleccionado} 
                        onChange={e => setMesSeleccionado(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {/* opciones de meses */}
                        <option value="1">Enero</option>
                        <option value="2">Febrero</option>
                        <option value="3">Marzo</option>
                        <option value="4">Abril</option>
                        <option value="5">Mayo</option>
                        <option value="6">Junio</option>
                        <option value="7">Julio</option>
                        <option value="8">Agosto</option>
                        <option value="9">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">Año</label>
                    <select 
                        value={añoSeleccionado} 
                        onChange={e => setAñoSeleccionado(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">Obra</label>
                    <select 
                        value={obrasfiltradas} 
                        onChange={e => setObrasFiltradas(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccione la obra </option>
                        {obras.map((obra) => (
                                <option key={obra.id} value={String(obra.id)}>
                                    {obra.nombreObra}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
        </div>

        {/* Resúmenes - Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Resumen del Mes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Resumen del Mes</h3>
                <div className="text-4xl font-bold text-blue-600">
                    ${Number(resumen?.totalGeneral || 0).toLocaleString('es-MX')}
                </div>
                <p className="text-sm text-gray-500 mt-1">Total general del mes</p>
            </div>

            {/* Gastos por Tasa */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Gastos por tasa</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">IVA 16%</span>
                        <span className="font-semibold text-blue-600">
                            ${total16.toLocaleString('es-MX')}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">IVA 8%</span>
                        <span className="font-semibold text-emerald-600">
                            ${total8.toLocaleString('es-MX')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Gastos por Obra */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Gastos por Obra</h3>
                <div className="space-y-3 max-h-52 overflow-y-auto">
                    {gastosObras.map((g, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600">{g.nombreObra}</span>
                            <span className="font-medium">${Number(g.totalGastos).toLocaleString('es-MX')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <FacturasList 
                facturas={facturasFiltradas} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                onView={handleViewFactura}
            />
        </div>

        {/* Modal Visor de Factura */}
        <FacturasVisor 
            isOpen={isViewerOpen}
            onClose={handleCloseViewer}
            facturaId={facturaSeleccionada?.id}
            factura={facturaSeleccionada}
        />
    </div>
</div>
    )
}