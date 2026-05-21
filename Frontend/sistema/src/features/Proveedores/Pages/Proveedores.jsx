import { useState, useEffect } from "react"
import ProveedorForm from "../Components/ProveedorForm"
import ProveedoresList from "../Components/ProveedoresList"
import ProveedorService from "../Services/ProveedoresServices"

export default function Proveedores()
{
    const [isOpen, setIsOpen] = useState(false)
    const [listProveedores, setListProveedores] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [idEdited, setIdEdited] = useState(null)
    const [proveedor, setProveedor] = useState({
        nombreP: '',
        rfc: ''
    })

    const handleOpenModal = () => {
        setIsOpen(true)
        setProveedor({
            nombreP: '',
            rfc: ''
        })
    }
    const handleCloseModal = () => {
        setIsOpen(false)
        setIdEdited(null)
        setEditMode(false)
        setProveedor({
            nombreP: '',
            rfc: ''
        })
    }

    const CargarProveedores = async () =>{
        const data = await ProveedorService.getAll()
        setListProveedores(data)
    }
    useEffect(() => {
        const loadProveedores = async () => {
            await CargarProveedores();
        };
        loadProveedores();
    },[])

    const handleChange = (e) =>{
        setProveedor({...proveedor, [e.target.name]: e.target.value})
    }

    const handleSubmit = async () => {
        try {
            if(editMode){
                await ProveedorService.update(idEdited, proveedor)
            }else{
                await ProveedorService.create(proveedor)
            }

            CargarProveedores()
            setIsOpen(false)
            setIdEdited(null)
            setEditMode(false)
            setProveedor({
                nombreP: '',
                rfc: ''
            })
        } catch (error) {
            console.error('Error al guardar el proveedor:', error)
            alert('Error al guardar el proveedor: ' + error.message)
        }
    }


    const handleEdit = (proveedor) => {

        setProveedor({
            nombreP: proveedor.nombreP,
            rfc: proveedor.rfc
        })

        setIsOpen(true)
        setEditMode(true)
        setIdEdited(proveedor.id)
    }

    const handleDelete = async (id) =>
    {
        if(!confirm('Desea eliminar el proveedor'))
            return
        await ProveedorService.delete(id)
        CargarProveedores()
    }
    return(
        <div className="min-h-screen px-6 py-7">
            <h1 className="text-center text-3xl font-bold py-6">Todos los Proveedores</h1>

            <div className="flex justify-end mt-4 mb-4">
                <button
                onClick={handleOpenModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition">+ Nuevo Proveedor</button>
            </div>

            <ProveedorForm 
                isOpen={isOpen}
                onClose={handleCloseModal}
                title={editMode ? "Editar Proveedor" : "Agregar Proveedor"}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Proveedor
                            </label>
                            <input 
                                type="text" 
                                name="nombreP"
                                value={proveedor.nombreP}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre"
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                RFC
                            </label>
                            <input 
                                type="text" 
                                name="rfc"
                                value={proveedor.rfc}
                                onChange={handleChange}
                                placeholder="Ej: ZABM790706HH6"
                                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button 
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-2xl transition duration-200 shadow-md"
                        >
                            {editMode ? 'Editar Proveedor' : 'Guardar Proveedor'}
                        </button>
                    </div>
                </div>
            </ProveedorForm>
            {/* Tabla de todos los proveedores */}

            <ProveedoresList proveedores={listProveedores} onEdit={handleEdit} onDelete={handleDelete}/>

        </div>
    )
}