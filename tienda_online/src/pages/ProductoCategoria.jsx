import { useContext, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Filter, SortAsc, RefreshCw, DollarSign } from 'lucide-react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    InputGroup,
} from 'react-bootstrap';
import Breadcrumb from "../components/Breadcrumb";
import { ProductContext } from "../context/ProductosContext";
import { useDocumentHead } from "../hooks/useDocumentHead";

import "../styles/pages/productocategoria.css"


export default function ProductoCategoria() {

    const { productos, loading, error } = useContext(ProductContext);
    const { nombre } = useParams();
    const location = useLocation();
    const esPlataforma = location.pathname.includes('/plataforma/');
    const esCategoria = location.pathname.includes('/categoria/');

    const [rango, setRango] = useState({ min: 0, max: Infinity });
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');

    {/* SEO para categorias/plataformas */}
    useDocumentHead({
        title: nombre ? `${nombre} - Tienda de Videojuegos Online` : 'Tienda de Videojuegos Online',
        description: `Explora nuestra selección de productos en la categoría/plataforma ${nombre}. Encuentra los mejores videojuegos para tu entretenimiento.`,
        keywords: `productos ${nombre}, tienda de videojuegos, juegos online, categoría ${nombre}, plataforma ${nombre}`
    });

    const limpiarFiltro = () => {
        setMin('');
        setMax('');
        setRango({ min: 0, max: Infinity });
    };

    if (loading) return <p className="text-center my-4">Cargando Productos...</p>;
    if (error) return <p className="text-danger text-center my-4">{error}</p>;

    // Mostrar los productos segun categoria/plataforma
    const productosFiltrados = productos.filter(p => {
        const nombreLower = nombre.toLowerCase();

        if (esPlataforma) {
            if (typeof p.plataforma === 'string') {
                return p.plataforma.toLowerCase() === nombreLower;
            }

            if (Array.isArray(p.plataforma)) {
                return p.plataforma.some(plat => plat.toLowerCase() === nombreLower);
            }
            return false;
        }
        
        return Array.isArray(p.categoria) &&
            p.categoria.some(cat => cat.toLowerCase() === nombreLower);
    });

    const productoFiltradosPorPrecio = productosFiltrados.filter(p => {
        const precio = Number(p.precio);
        return (!rango.min || precio >= rango.min) && (!rango.max || precio <= rango.max);
    });

    // Manejar el submit del formulario de precio
    const handleInputPriceChange = e => {
        e.preventDefault();
        setRango({
            min: Number(min) || 0,
            max: Number(max) || Infinity, // Usar Infinity como valor por defecto para 'hasta'
        });
    };

    return (
        <Container className="my-4">
            {/* --- Breadcrumb Superior Izquierdo --- */}
            <Row className="mb-3">
                <Col>
                    {/* Usando tu componente Breadcrumb si lo necesitas, o el de Bootstrap si es simple */}
                    <Breadcrumb categoria={esCategoria ? [nombre] : []} plataforma={esPlataforma ? nombre : ""} productoNombre={''} />
                </Col>
            </Row>

            {/* --- Barra superior: nombre de categoría y botón ordenar --- */}
            <Row className="align-items-center mb-4">
                <Col>
                    <h1 className="mb-0">{nombre}</h1>
                </Col>
                <Col xs="auto">
                    <Button variant="outline-secondary" className="d-flex align-items-center">
                        <SortAsc size={18} className="me-2" />
                        Ordenar
                    </Button>
                </Col>
            </Row>

            {/* --- Contenido principal: filtros (izquierda) + productos (derecha) --- */}
            <Row>
                {/* Filtros de precio (Columna izquierda - Se puede ocultar en pantallas pequeñas) */}
                <Col lg={3} className="mb-4">
                    <Card className="filter-card-fixed-height">
                        <Card.Header as="h5" className="d-flex align-items-center">
                            <Filter size={20} className="me-2" />
                            Filtros
                        </Card.Header>
                        <Card.Body>
                            <Card.Title className="mb-3">Precio</Card.Title>
                            <Form onSubmit={handleInputPriceChange}>
                                <Row className="g-2 mb-3">
                                    <Col>
                                        <Form.Group controlId="filtroMin">
                                            <Form.Label className="small mb-1">Desde</Form.Label>
                                            <InputGroup size="sm">
                                                <InputGroup.Text><DollarSign size={16} /></InputGroup.Text>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="0"
                                                    value={min}
                                                    onChange={e => setMin(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="filtroMax">
                                            <Form.Label className="small mb-1">Hasta</Form.Label>
                                            <InputGroup size="sm">
                                                <InputGroup.Text><DollarSign size={16} /></InputGroup.Text>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="999"
                                                    value={max}
                                                    onChange={e => setMax(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" size="sm">
                                        Filtrar
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" onClick={limpiarFiltro} className="d-flex align-items-center justify-content-center">
                                        <RefreshCw size={14} className="me-1" />
                                        Limpiar Filtro
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Lista de productos (Columna derecha) */}
                <Col lg={9}>
                    {productoFiltradosPorPrecio.length > 0 ? (
                        <Row xs={1} sm={2} md={3} xl={4} className="g-4">
                            {productoFiltradosPorPrecio.map(producto => (
                                <Col key={producto.id}>
                                    <Card className="shadow-sm">
                                        <Link
                                            to={
                                                esPlataforma
                                                    ? `/productos/${producto.plataforma || 'sin-plataforma'}/${producto.id}`
                                                    : `/productos/${producto.categoria || 'sin-categoria'}/${producto.id}`
                                            }
                                            state={{ producto }}
                                            className="text-decoration-none text-dark"
                                        >
                                            <Card.Img
                                                variant="top"
                                                src={producto.imagen}
                                                alt={producto.nombre}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title as="h5" className="text-truncate">
                                                    {producto.nombre}
                                                </Card.Title>
                                                <Card.Text className="fw-bold mt-auto text-success">
                                                    ${Number(producto.precio).toLocaleString('es-AR', {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </Card.Text>
                                            </Card.Body>
                                        </Link>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div className="text-center alert alert-info">
                            No se encontraron productos con los filtros seleccionados.
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}