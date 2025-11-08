import "../styles/pages/detalleproducto.css"
import { Link, useParams, useLocation } from "react-router-dom";
import { useCarritoContext } from '../context/CarritoContext'
import { ProductContext } from "../context/ProductosContext";
import { useContext, useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

export default function ProductoDetalle() {
  const { id } = useParams();
  // const location = useLocation();
  const { productos, loading, error } = useContext(ProductContext);
  // const [producto, setProducto] = useState(location.state?.producto);
  const {agregarAlCarrito} = useCarritoContext();
  const [cantidad, setCantidad] = useState(1);
  const producto = productos.find(p => p.id === id);

  if(loading) return <p>Cargando Productos...</p>;

  if(error) return <p>{error}</p>;
 
  return(
    <div className="card-details-product">
      {/* Columna izquierda: imagen */}
      <div className="card-details-left">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="card-details-img"
        />
      </div>

      {/* Columna derecha: info + descripción */}
      <div className="card-details-right">
        {/* Breadcrumb */}
        <Breadcrumb categorias={producto.categoria} productoNombre={producto.nombre}></Breadcrumb>

        {/* Título - Precio*/}
        <h2 className="card-details-title">{producto.nombre}</h2>

        <p className="card-details-price">
          ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </p>
        {/* Selector Stock - Boton Agregar al Carrito*/}
        <div className="card-details-carrito">
          <p className="card-details-stock">Stock disponible: {producto.stock}</p>
          <div className="qty-button">
            <input 
              type="number" 
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="qty-input"
            />
            <button
              className="btn-agregar"
              onClick={() => agregarAlCarrito(producto, cantidad)}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
        {/* Descripción */}
        <div className="card-details-description">
          <h3>Descripción</h3>
          <ul>
            {producto.descripcion.map((linea, index) => (
              <li key={index}>{linea}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
);
};