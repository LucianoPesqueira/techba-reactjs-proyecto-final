import { useParams } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { ShoppingCart, Package } from 'lucide-react';
import Breadcrumb from "../components/Breadcrumb";

import { useCarritoContext } from '../context/CarritoContext'
import { useProductContext } from "../context/ProductosContext";
import { useDocumentHead } from "../hooks/useDocumentHead";

import "../styles/pages/detalleproducto.css"

export default function ProductoDetalle() {
  const { id } = useParams();
  const { productos, loading, error } = useProductContext();
  const {agregarAlCarrito} = useCarritoContext();
  const [cantidad, setCantidad] = useState(1);
  const producto = productos.find(p => p.id === id);

  {/* SEO - Detalle del Producto */}
  useDocumentHead({
    title: producto?.nombre ? `${producto.nombre}` : 'Comprar videojuegos online al mejor precio',
    description: producto
  ? `compra ${producto.nombre} para ${producto.plataforma || 'todas las plataformas'}. 
     Género: ${
       Array.isArray(producto.categoria)
         ? producto.categoria.join(' / ')
         : producto.categoria || 'varios géneros'
     }. 
     Precio: $${Number(producto.precio).toLocaleString('es-AR', {
       minimumFractionDigits: 2
     })}.`
  : 'Venta de videojuegos online para todas las plataformas y géneros. Encuentra los mejores precios y ofertas en nuestra tienda de videojuegos.',
 
    keywords: producto?.nombre ? `${producto?.nombre}, comprar, precio, juegos` : 'videojuegos, tienda, comprar'
  });

  
  if(loading) return <p>Cargando Productos...</p>;
  if(error) return <p>{error}</p>;


  return (
      <Container className="my-5"> {/* Container de Bootstrap */}
      <Row className="g-4"> {/* Fila principal, g-4 para un buen espaciado */}
        
        {/* Columna Izquierda: Imagen del Producto */}
        <Col xs={12} lg={6} className="d-flex justify-content-center"> 
          <Card className="shadow-sm border-0" style={{ maxWidth: '400px', width: '100%' }}>
            <Card.Img 
              variant="bottom" 
              src={producto.imagen}
              alt={producto.nombre}
            />
          </Card>
        </Col>

        {/* Columna Derecha: Información y Descripción */}
        <Col xs={12} lg={6}>
          
          {/* Breadcrumb */}
          <Breadcrumb categoria={producto.categoria} plataforma={producto.plataforma} productoNombre={producto.nombre} />

          {/* Título */}
          <h1 className="fw-bold mb-2">{producto.nombre}</h1>

          {/* Precio */}
          <p className="fs-3 fw-bolder mb-3 text-success">
            ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>

          {/* Stock */}
          <div className="d-flex align-items-center mb-3">
            <Package size={18} className="me-2 text-secondary" /> 
            <p className="mb-0 text-muted">
              Stock disponible: **{producto.stock}**
            </p>
          </div>
          
          <hr />

          {/* Selector de Cantidad y Botón */}
          <div className="d-flex align-items-center mb-4">
            <Form.Group controlId="formQuantity" className="me-3">
              <Form.Label className="d-none">Cantidad</Form.Label>
              <Form.Control 
                type="number" 
                min="1"
                max={producto.stock}
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, Math.min(producto.stock, Number(e.target.value))))} // Asegurar que no exceda min/max
                style={{ width: '80px', textAlign: 'center' }}
              />
            </Form.Group>
            
            <Button
              variant="primary" 
              onClick={() => agregarAlCarrito(producto, cantidad)}
              disabled={producto.stock === 0}
              className="flex-grow-1 boton-carrito" // Ocupa el espacio restante
            >
              <ShoppingCart size={18} className="me-2" />
              {producto.stock > 0 ? 'Agregar al carrito' : 'Sin Stock'}
            </Button>
          </div>

          <hr />

          {/* Descripción */}
          <div className="mt-4">
            <h3 className="h5 fw-bold mb-3">Descripción</h3>
            <ListGroup variant="flush">
              {producto.descripcion.map((linea, index) => (
                <ListGroup.Item key={index} className="px-0 py-1">{linea}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
}