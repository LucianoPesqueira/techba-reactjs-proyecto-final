import '../styles/components/navbarcustom.css'
import { Navbar, Nav, Container, NavDropdown, Form, Button, ButtonGroup, InputGroup} from 'react-bootstrap';
import { ShoppingBasket, Search, User, Contact, List } from 'lucide-react';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoPerfil from '../assets/img/lnp-store.png'

import { useCarritoContext } from '../context/CarritoContext'
import { useProductContext } from '../context/ProductosContext';
import { useUserContext } from '../context/UsuarioContext';

export default function NavbarCustom() {
  const {carrito} = useCarritoContext();
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);//suma cantidad
  const { productos, loading, error, filteredProduct, searchProduct } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { user, logout, isAuthenticated, isAdmin } = useUserContext();

  const [expanded, setExpanded] = useState(false);


  //del context productos obtengo los nombres de estado
  if(loading) return <p>Cargando Productos...</p>;
  if(error) return <p>{error}</p>;
  if (!productos || productos.length === 0) return <p>No hay productos....</p>;

  //cargo las categorias - plataformas
  const plataformas = [...new Set(productos.flatMap(p => p.plataforma))];
  const categorias = [...new Set(productos.flatMap(p => p.categoria))];

  // const handleLogout = () => {
  //   logout();
  // };

  return (
    <>
      {/* 🔹 Navbar principal */}
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top" className="py-2" >
        <Container fluid className='align-items-center'>
          {/* Izquierda: buscador */}
          <Form className="d-flex me-auto">
            <InputGroup>
              <Form.Control
                type="search"
                id='productSearchInput'
                value={searchTerm}
                size='sm'
                placeholder="Buscar..."
                aria-label="Search"
                required
                onChange={(e) => {
                  searchProduct(e.target.value);
                  setSearchTerm(e.target.value);
                }}
              />
              <Button 
                variant="outline-secondary"
                aria-label="Buscar productos" 
                onClick={() => {
                  navigate("/buscarProducto", { state: { filteredProduct } });
                  setSearchTerm('');
                }}
              >
                {/* <i className="fa-solid fa-magnifying-glass"></i> */}
                <Search size={18} />
              </Button>
            </InputGroup>
          </Form>
          {/* Centro: logo */}
          <Navbar.Brand className='mx-auto d-flex align-items-center d-none d-md-block'>{/*d-sm-none oculta logo en pantalla chica */}
            <Link to="/">
              <img
                src={LogoPerfil}
                alt="logo"
                className="me-2 img-logo-navbar"
                width="400"
                height="300"
              />
            </Link>
          </Navbar.Brand>
          {/* Derecha: Iniciar Sesion - Admin - Carrito */}
          <Nav className="ms-auto d-flex align-items-center">
            <ButtonGroup className='card-buttons-right'>
              <Button
                variant="link"
                aria-label="Abrir perfil de usuario"
                size="lg"
                className="text-white"
                as={Link}
                to={isAuthenticated ? '/perfil' : '/iniciarSesion'}
              >
                {/* <i className="fa-solid fa-user m-2 card-user-icon"></i> */}
                <User size={22} className="me-1 card-user-icon" />
                <span className="card-user-span text-white text-decoration-none">
                  {isAuthenticated ? `¡Hola!, ${user.nombre}` : 'Iniciar sesión / Registrarse'}
                </span>
              </Button>

              {isAuthenticated && (
                <>
                  {isAdmin && (
                    <Button variant='link' size='md' className='card-user-admin text-white ms-2' as={Link} to={'/dashboard'}>
                      Admin
                    </Button>
                  )}
                  {/* <Button variant='link' size='md' className='text-white ms-2 card-user-logout' onClick={handleLogout}>Salir</Button> */}
                </>
              )}
              {/*Link carrito */}
              <Button variant="link" aria-label='Ver carrito de compras' size='lg' className='text-white' as={Link} to={'/carrito'}>
                {/* <i className="fa-solid fa-basket-shopping me-1"></i> */}
                <ShoppingBasket size={24} className="me-1" />
                <span className='card-cart-shopping-span'>{cantidadTotal}</span>
              </Button>    
            </ButtonGroup>   
          </Nav>
        </Container>
      </Navbar>


      {/* 🔹 Navbar secundaria (categorías) */}
      <Navbar bg="light" expand="lg" collapseOnSelect expanded={expanded} className="border-bottom">
        <Container fluid>
          {/*boton menu visible en pantalla chica */}
          <Navbar.Toggle aria-controls="navbar-secundario" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="navbar-secundario" className='justify-content-between'>
            
            {/*izq: dropdown categoria y lista plataforma*/}
            <Nav className='flex-column flex-lg-row'>
              {/*dropdown categoria */}
              <NavDropdown title="Categorias" id="dropdown-categorias">
                {categorias.map((cat) => (
                  <NavDropdown.Item 
                    as={Link} 
                    to={`/categoria/${cat}`} 
                    key={cat}
                    onClick={() => setExpanded(false)}//lo cierra
                  >
                    {cat}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              {/*lista plataforma */}
              {plataformas.map((plat) => (
                <Nav.Link 
                  as={Link} 
                  key={plat} 
                  to={`/plataforma/${plat}`} 
                  className="card-categorias-link"
                  onClick={() => setExpanded(false)}//lo cierra
                >
                  {`Juegos ${plat}`}
                </Nav.Link>
              ))}            
            </Nav>           
            {/*Links derecha */}
            <Nav>
              <Nav.Link as={Link} to="/contacto" className="align-items-center" onClick={() => setExpanded(false)}>
                {/* <i className="fa-solid fa-file-signature me-1"></i> */}
                <Contact size={18} className="me-1" />
                <span className='card-contact'>Contacto</span>
              </Nav.Link>

              <Nav.Link as={Link} to="/productos" className="align-items-center" onClick={() => setExpanded(false)}>
                {/* <i className="fa-solid fa-list me-1"></i> */}
                <List size={18} className="me-1" />
                <span className='card-product-buttom'>Productos</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  );
}


//resaltar en que parte de la pagina estoy:
//si estoy en productos que el boton de navbar se muestre con un color llamativo
//para que el usuario sepa donde se encuentra

//https://www.react-icons.com/