import LoginForm from "../Components/LoginForm";

export default function Login({ onLogin })
{
    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesion</h1>
                    <p className="text-gray-500 mt-2">Del Toro Servicios y Mantenimiento</p>
                </div>

                <LoginForm onLogin={onLogin}/>
            </div>
        </div>
    )
}