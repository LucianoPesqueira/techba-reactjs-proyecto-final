import "../styles/pages/buscarproducto.css"
import { Link, useLocation, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { ProductContext } from "../context/ProductosContext";
import { useContext, useState } from "react";

export default function ProductoCategoria() {
    const { productos, loading, error } = useContext(ProductContext);
    const { nombre } = useParams();
    const location = useLocation();
    const esPlataforma = location.pathname.includes('/plataforma/');

    const [rango, setRango] = useState({ min: 0, max: Infinity});
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');

    const limpiarFiltro = () => {
        setMin("");
        setMax("");
        setRango({ min: 0, max: Infinity});
    };

    if(loading) return <p>Cargando Productos...</p>;
    if(error) return <p>{error}</p>;

    {/*mostrar los productos segun categoria/plataforma */}
    const productosFiltrados = productos.filter(p =>
        esPlataforma ? p.plataforma?.some(plat => plat.toLowerCase() === nombre.toLowerCase())
        : p.categoria?.some(cat => cat.toLowerCase() === nombre.toLowerCase())
    );

    const productoFiltradosPorPrecio = productosFiltrados.filter((p) => { 
        const precio = Number(p.precio);
        return (
            (!rango.min || precio >= rango.min) &&
            (!rango.max || precio <= rango.max)
        );
    });

    {/* manejar los inputs min/max de precio */}
    const handleInputPriceChange = (e) => {
        e.preventDefault();
        setRango({
            min: Number(min) || 0,
            max: Number(max) || 999
        });
    }

    return (
        <div className="card-category-product">

            {/* --- Breadcrumb Superior Izquierdo --- */}
            <div className="breadcrumb-left">
                <Breadcrumb categorias={[nombre]} plataformas={[nombre]} productoNombre={""} />
            </div>

            {/* --- Barra superior: nombre de categoría y botón ordenar --- */}
            <div className="category-top-bar">
                <div className="category-top-left">
                    <h2>{nombre}</h2>
                </div>
                <div className="category-top-right">
                    <p className="btn-order"><i className="fa-solid fa-sort"></i>Ordenar</p>
                </div>
            </div>

            {/* --- Contenido principal: filtros (izquierda) + productos (derecha) --- */}
            <div className="category-content">
                {/* Filtros de precio */}
                <div className="details-filters">{/*detalle-filtros*/}
                    <h3>Precio</h3>
                    <div className="price-filters">
                        <div className="price-filters-item">
                            <label>Desde</label>
                            <input 
                                type="number" 
                                placeholder="0" 
                                value={min} 
                                onChange={(e) => setMin(e.target.value)}
                            />
                        </div>
                        <div className="price-filters-item">
                            <label>Hasta</label>
                            <input 
                                type="number"
                                placeholder="104800"
                                value={max}
                                onChange={(e) => setMax(e.target.value)}
                            />
                        </div>
                        <button 
                            className="price-btn" 
                            type="submit" 
                            onClick={handleInputPriceChange}
                        >Filtrar</button>
                    </div>
                </div>

                {/* Lista de productos */}
                <div className="details-products">
                    {productoFiltradosPorPrecio.length > 0 ? (
                        <ul className="product-list">
                            {productoFiltradosPorPrecio.map((producto) => (
                                <li key={producto.id} className="product-item">
                                    <Link
                                        to={esPlataforma ? `/productos/${producto.plataforma || 'sin-plataforma'}/${producto.id}`:
                                    `/productos/${producto.categoria || 'sin-categoria'}/${producto.id}`}
                                        state={{ producto }}
                                    >
                                        <img src={producto.imagen} alt={producto.nombre} className="product-img" />
                                        <div className="product-body">
                                            <h3 className="product-title">{producto.nombre}</h3>
                                            <p className="product-price">
                                                ${Number(producto.precio).toLocaleString("es-AR", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : productoFiltradosPorPrecio.length === 0 ? (
                        <p>No hay productos en esta categoría</p>
                    ):(
                        <p>Cargando productos...</p>
                    )}
                </div>
            </div>
        </div>
    );
}; 