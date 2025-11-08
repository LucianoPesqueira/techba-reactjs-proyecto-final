import './styles/index.css'

import Inicio from './pages/Inicio'
import Contacto from './pages/Contacto'
import Navbar from './components/NavbarCustom'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import ProductoCategoria from './pages/ProductoCategoria'
import Carrito from './pages/Carrito'
import Pagar from './pages/Pagar'
import Login from './pages/Login'
import BuscarProducto from './pages/BuscarProducto'
import Footer from './components/Footer'
import RutaProtegida from './pages/RutaProtegida'

import { Routes, Route} from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { ProductosProvider } from './context/ProductosContext'
import { UsuarioProvider } from './context/UsuarioContext'

function App() {

  return (
    <>
        <UsuarioProvider>
          <ProductosProvider>
            <CarritoProvider>
              <Navbar />
              <div className='main-container'>
              <Routes>
                <Route path='/' element={<Inicio/>} />
                <Route path='/contacto' element={<Contacto />} />
                <Route path='/productos' element={<Productos />} />
                <Route path='/productos/:categoria/:id' element={<DetalleProducto />}/>
                <Route path='/productos/:plataforma/:id' element={<DetalleProducto />}/>
                <Route path='/categoria/:nombre' element={<ProductoCategoria/>}/>
                <Route path='/plataforma/:nombre' element={<ProductoCategoria/>}/>
                <Route path='/buscarProducto' element={<BuscarProducto />}/>
                <Route path='/login' element={<Login />}/>
                <Route path='/carrito' element={<Carrito />} />

                {/* Ruta protegida solo para usuarios */}
                <Route path='/pagar' element={<RutaProtegida> <Pagar /> </RutaProtegida>} />
                {/*ruta para perfil usuario */}

                {/* Ruta protegida solo para admin */}
                {/* Ruta para Dashboard - CRUD */}
                
              </Routes>
              </div>
              
            </CarritoProvider>
          </ProductosProvider>
        </UsuarioProvider>
      <Footer />
    </>
  )
}

export default App
