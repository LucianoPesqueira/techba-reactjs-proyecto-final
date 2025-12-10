import "../styles/pages/productos.css"
import { Link } from "react-router-dom";
import { useProductContext } from '../context/ProductosContext';
import { useDocumentHead } from "../hooks/useDocumentHead";


export default function Productos() {

  useDocumentHead({
      title: "Todos los Productos - LNP Store",
      description: "Explora todos los productos disponibles en LNP Store. Encuentra videojuegos para todas las plataformas y géneros al mejor precio.",
      keywords: "tienda de videojuegos, catálogo de juegos, videojuegos online, comprar juegos en línea"
    });

  const { productos, loading, error } = useProductContext();

  if(loading) return <p>Cargando Productos...</p>;
  if(error) return <p>{error}</p>;

  return (
    <ul className="card-product-list">
      {productos.map((producto) => (
        <li key={producto.id} className="card-product">
          <Link to={`/productos/${producto.categoria || 'sin-categoria'}/${producto.id}`} state={{producto}}>
          <img src={producto.imagen} alt={producto.nombre} 
            className="card-product-img"
            width="400"
            height="300"
          />
          <div className="card-body">
            <h3 className="card-title">{producto.nombre}</h3>
            <p className="text-success card-price">${producto.precio.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
          </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
