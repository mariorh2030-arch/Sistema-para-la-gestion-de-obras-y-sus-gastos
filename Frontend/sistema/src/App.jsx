import { useState, useEffect } from 'react'
import SideBar from './Components/Layouts/SideBar'
import Facturas from './features/Facturas/Pages/Facturas'
import Obras from './features/Obras/Pages/Obras'
import Proveedores from './features/Proveedores/Pages/Proveedores'
import Login from './features/Login/Pages/Login'
import Cotizaciones from './features/Cotizaciones/Pages/Cotizaciones'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

//  PrivateRoute va FUERA del componente App, no dentro de un useEffect
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(true)
  const [isAuthenticated, setIsAthenticated] = useState(false)

  // El useEffect debe revisar el token para persistir sesión al recargar
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsAthenticated(true)
  }, [])

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAthenticated(true)} />
  }

  return (
    <BrowserRouter>
      <div className='flex'>
        <SideBar isOpen={sidebarAbierto} onToggle={() => setSidebarAbierto(!sidebarAbierto)} />
        <main className='flex-1 min-h-screen overflow-hidden'>
          <Routes>
            <Route path='/' element={<Facturas/>} />
            <Route path='/obras' element={<Obras/>} />
            <Route path='/proveedores' element={<Proveedores/>} />
            <Route path='/cotizaciones' element={<Cotizaciones/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
