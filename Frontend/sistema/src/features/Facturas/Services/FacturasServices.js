
const URL_API = "http://localhost:5146/api/facturas";

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const FacturaService = {
    getAll: async () => {
        const response = await fetch(URL_API);
        if(!response.ok) throw new Error('Error al obtener la informacion');
        return response.json();
    },

    getResumenMes: async (mes, año) => {
        const response = await fetch(`${URL_API}/resumen-mes?mes=${mes}&año=${año}`,
            {headers: getHeaders()}
        );
        if(!response.ok) throw new Error('Error al obtener el resumen');
        return response.json();
    },
    getGastosObras: async (mes, año) => {
        const response = await fetch(`${URL_API}/gastos-obras?mes=${mes}&año=${año}`,
            {headers: getHeaders()}
        );
        if(!response.ok) throw new Error('Error al obtener los gastos')
        return response.json();
    },

    getGastosTasa: async (mes, año) =>{
        const response = await fetch(`${URL_API}/gastos-tasa?mes=${mes}&año=${año}`,
            {headers: getHeaders()}
        );
        if(!response.ok) throw new Error('Error al obtener los gastos por tasa')
        return response.json();
    },

    getIvas: async () => {
        const response = await fetch('http://localhost:5146/api/ivas');
        if(!response.ok) throw new Error('Error al obtener la informacion');
        return response.json();
    },

    getPayMethods: async () =>{
        const response = await fetch('http://localhost:5146/api/metodo-pago');
        if(!response.ok) throw new Error('Error al obtener la informacion');
        return response.json();
    },

    create: async (factura) => {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(factura)
        })
        if(!response.ok){
            const errorText = await response.text()
            throw new Error(`Error al insertar la informacion (${response.status}): ${errorText}`)
        }
        return response.json();
    },

    UploadFile: async (id, file, tipoArchivo) => {
        const formData = new FormData()
        formData.append('Archivo', file)
        formData.append('TipoArchivo', tipoArchivo) 

        const response = await fetch(`http://localhost:5146/api/archivos/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Error al subir el archivo (${response.status}): ${errorText}`)
        }

        return response.json()
    },

    update: async (id, factura) => {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(factura)
        })
        if(!response.ok) throw new Error('Error al actualizar los datos');
        if(response.status === 204) return null;
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        })
        if(!response.ok) throw new Error('Error al eliminar los datos')
    }

}

export default FacturaService