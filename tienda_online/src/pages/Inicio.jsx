import { Link } from "react-router-dom";
import { Carousel, Row, Col, Container, Card } from 'react-bootstrap';
import { Gamepad2, ShoppingCart } from 'lucide-react';
import { useProductContext } from '../context/ProductosContext';
import { useDocumentHead } from "../hooks/useDocumentHead";

import '../styles/pages/inicio.css'



const productCarouselSlide = ({ items }) => (
    <Row className='justify-content-center'>
      {items.map((producto) => (
        <Col xs={6} sm={4} md={3} lg={2} key={producto.id} className='mb-4'>
          <Link 
            to={`/productos/${producto.categoria || 'sin-categoria'}/${producto.id}`} 
            state={{producto}}
            className='link-card'
          >
            <Card className='text-center shadow-sm h-100' style={{ maxWidth: '180px', margin: 'auto' }}>
              <Card.Img
                variant='top'
                src={producto.imagen}
                alt={producto.nombre}
                style={{ height: '100px', objectFit: 'cover' }}
              />
              <Card.Body className='p-2'>
                <Card.Title className='fs-6 mb-1 text-truncate' title={producto.nombre}>
                    {producto.nombre}
                </Card.Title>
                <Card.Text className='fw-bold text-success'>
                    ${Number(producto.precio).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}  
    </Row>
  );

export default function Inicio() {

  {/* SEO - inicio */}
  useDocumentHead({
    title: "LNP Store - Inicio",
    description: "Bienvenido a LNP Store, tu tienda online de videojuegos. Descubre los últimos lanzamientos y los juegos más vendidos.",
    keywords: "tienda de videojuegos, juegos online, lanzamientos de videojuegos, juegos más vendidos"
  });

  const { productos, getRandomProducts, loading, error } = useProductContext();

  {/*obtengo 5 productos randomicamente para mostrarlo como los mas vendidos */}
  const randomProducts = productos.length > 0
    ? getRandomProducts(5)
    : [];

  if(loading) return <p>Cargando Productos...</p>;
  if(error) return <p>{error}</p>;
  if (!randomProducts || randomProducts.length === 0) return <p>No hay productos....</p>;

  const slides = [
    { id: 1, title : "Battlefield 6", url: "https://images.igdb.com/igdb/image/upload/t_720p/scy45o.webp", alt: "Nuevo Shooter en primera persona"},
    { id: 2, title : "ARC Raiders", url: "https://images.igdb.com/igdb/image/upload/t_720p/ar47zf.webp", alt: "Shooter de Extraccion/ Multijugador"},
    { id: 3, title : "Battlefield REDSEC", url: "https://images.igdb.com/igdb/image/upload/t_720p/sc103gp.webp", alt: "Free-to-Play de Battlefield"},
    { id: 4, title : "Warframe: The Old Peace", url: "https://images.igdb.com/igdb/image/upload/t_720p/scy1pd.webp", alt: "Nueva expansion de Warframe: The Old Peace"},
  ];


  return (
    <>
      <Container className='my-5'>
        <h2 className='text-center mb-4 text-primary'>
          <Gamepad2 size={32} className='me-2' />
          Lanzamientos Destacados
        </h2>
        <Carousel controls indicators className='mb-5 shadow-lg'>
          {slides.map((item, index) => (
            <Carousel.Item key={item.id} interval={5000}>
              <div className='carousel-portada d-flex bg-dark text-white align-items-center justify-content-center'>
                <img 
                  src={item.url}
                  alt={item.alt}
                  className='img-fluid portada'
                  width="1280"
                  height="720"
                  //para optimizar carga de imagenes
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding={index === 0 ? 'sync' : 'async'}
                />
              </div>
              <Carousel.Caption className='bg-dark bg-opacity-75 p-3 rounded'>
                <h3 className='fw-bold'>{item.title}</h3>
                <p>{item.alt}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        <hr />

        {/* los 5 productos mas vendidos */}
        <h2 className='text-center my-4 text-success'>
          <ShoppingCart size={32} className='me-2' />
          Los 5 Productos Más Vendidos
        </h2>
        <Carousel controls indicators={false} className='product-carousel'>
          <Carousel.Item>
            {productCarouselSlide({ items: randomProducts })}
          </Carousel.Item>
        </Carousel>
      </Container>
    </>
  );
};


{/*
  Deploy en Vercel - Netlify
  Guia: https://github.com/maticampos/vercel312
  Deploy: https://vercel312.vercel.app/

  Guia: https://github.com/maticampos/netlify312
  Deploy: https://tiendajuegosnetlify.netlify.app/
  */}