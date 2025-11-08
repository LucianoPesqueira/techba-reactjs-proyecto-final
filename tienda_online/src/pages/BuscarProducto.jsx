import React, { useContext } from 'react'
import { ProductContext } from '../context/ProductosContext';
import { useLocation, Link } from 'react-router-dom';

function BuscarProducto() {
    const location = useLocation();
    const { filteredProduct } = location.state || {};
  return (
    <ul className="card-product-list">
      {filteredProduct && filteredProduct.length > 0 ? filteredProduct.map((producto) => (
        <li key={producto.id} className="card-product">
          <Link to={`/productos/${producto.categoria || 'sin-categoria'}/${producto.id}`} state={{producto}}>
          <img src={producto.imagen} alt={producto.nombre} className="card-product-img"></img>
          <div className="card-body">
            <h3 className="card-title">{producto.nombre}</h3>
            <p className="card-price">${producto.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
          </div>
          </Link>
        </li>
      )) : (
        <p>No se encontraron productos.</p>
      )}
    </ul>
  )
}

export default BuscarProducto