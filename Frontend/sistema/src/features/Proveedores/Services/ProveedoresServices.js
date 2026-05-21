
const URL_API = "http://localhost:5146/api/proveedores"

const ProveedorService = {

    getAll: async () => {
        const response = await fetch(URL_API)
        if(!response.ok) throw new Error("Error al cargar la informacion")
        return response.json()
    },

    create: async (proveedor) =>{
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(proveedor)
        })
        if(!response.ok)
            throw new Error("Error al insertar la informacion")

        return response.json()
    },
    
    update: async (id, proveedor) => {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(proveedor)
        })
        if(!response.ok) throw new Error('Error al actualizar los datos')
        if (response.status === 204) return null
        return response.json()
    },
    delete: async (id) =>{
        console.log('URL:', `${URL_API}/${id}`)
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        })
        console.log('Status:', response.status)
        if(!response.ok) throw new Error('Error al eliminar los datos')
    }
}

export default ProveedorService