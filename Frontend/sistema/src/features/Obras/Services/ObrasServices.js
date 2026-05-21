
const API_BASE_URL = "http://localhost:5146/api";
const URL_API = `${API_BASE_URL}/controller`;
const URL_API_PATRONAL = `${API_BASE_URL}/patronal`;

const checkResponse = (response, message) => {
    if(!response.ok) {
        console.error('API request failed:', response.url, response.status, response.statusText)
        throw new Error(message)
    }
    return response
}

const ObraService = {
    getAll: async () => {
        console.log('Fetching obras from', URL_API)
        const response = await fetch(URL_API)
        checkResponse(response, 'Error al obtener la informacion')
        return response.json()
    },

    getPatronal: async () => {
        console.log('Fetching patronales from', URL_API_PATRONAL)
        const response = await fetch(URL_API_PATRONAL)
        checkResponse(response, 'Error al obtener la informacion')
        return response.json()
    },

    create: async (obra) => {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(obra)
        })
        checkResponse(response, 'Error al insertar la informacion')
        return response.json()
    },

    update: async (id, obra) => {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(obra)
        })
        checkResponse(response, 'Error al actualizar los datos')
        if (response.status === 204) return null
        return response.json()
    },

    delete: async (id) => {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        })
        checkResponse(response, 'Error al eliminar los datos')
    }
}
export default ObraService