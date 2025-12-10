import './styles/index.css'

import Inicio from './pages/Inicio'
import Contacto from './pages/Contacto'
import Navbar from './components/NavbarCustom'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import ProductoCategoria from './pages/ProductoCategoria'
import Carrito from './pages/Carrito'
import Pagar from './pages/Pagar'
import IniciarSesion from './pages/IniciarSesion'
import BuscarProducto from './pages/BuscarProducto'
import Footer from './components/Footer'
import RutaProtegida from './pages/RutaProtegida'
import UserProfile from './pages/UserProfile'
import Dashboard from './pages/Dashboard'

import { Toaster} from 'react-hot-toast'
import { Routes, Route} from 'react-router-dom'
import { CarritoProvider } from './context/CarritoContext'
import { ProductosProvider } from './context/ProductosContext'
import { UsuarioProvider } from './context/UsuarioContext'

function App() {

  return (
    <>
        {/*Me permite mostrar un mensaje en caso de ingresar a ciertas rutas que no este logueado o admin */}
        <Toaster position='top-center' reverseOrder={false} />

        <div className='app-wrapper'>
          <UsuarioProvider>
            <ProductosProvider>
              <CarritoProvider>

                <Navbar />

                <main className='main-content'>
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
                      <Route path='/iniciarSesion' element={<IniciarSesion />}/>
                      <Route path='/carrito' element={<Carrito />} />

                      {/* Rutas protegidas usuarios - admin*/}
                      <Route path='/pagar' element={<RutaProtegida> <Pagar /> </RutaProtegida>} />
                      <Route path='/perfil' element={<RutaProtegida> <UserProfile /> </RutaProtegida>} />
                      <Route path='/dashboard' element={<RutaProtegida soloAdmin> <Dashboard /> </RutaProtegida>} />
                      
                    </Routes>
                  </div>
                </main>

                <Footer />  
                
              </CarritoProvider>
            </ProductosProvider>
          </UsuarioProvider>
      </div>
    </>
  );
}

export default App
