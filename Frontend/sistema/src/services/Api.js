
//src/services/api

const API_URL = 'http://localhost:5146/api';

const api = {
    //login 
    login: async(email, password) => {
        const response = await fetch(`${API_URL}/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if(!response.ok)
        {
            const error = await response.json();
            throw new Error(error.message || 'Error en el login');
        }
        return response.json();
    },

}
export default api;