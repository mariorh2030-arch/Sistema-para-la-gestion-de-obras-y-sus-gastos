import { useState } from "react";
import api from '../../../services/Api.js';

export default function LoginForm({ onLogin }){
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try
        {
            if (isRegister) {
                await api.register(email, password, nombre, apellido);
                setError('Usuario registrado. Ahora puedes iniciar sesión.');
                setIsRegister(false);
            } else {
                const data = await api.login(email, password);

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLogin();
            }
        } catch(err){
            setError(err.message || 'Error');
        } finally{
            setLoading(false);
        }
    };

    return(
        <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2"> 
                            Nombre 
                        </label>
                        <input 
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tu nombre"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2"> 
                            Apellido 
                        </label>
                        <input 
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tu apellido"
                            required
                        />
                    </div>
                </>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"> 
                    Correo 
                </label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tu@gmail.com"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"> 
                    Contraseña
                </label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition disabled:bg-gray-400"
            >
                {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar sesión')}
            </button>

            <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="w-full text-blue-600 hover:text-blue-800 text-sm"
            >
                {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
        </form>
    )

}