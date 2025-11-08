import { createContext, useEffect, useState } from 'react';
import { CardText } from 'react-bootstrap';

export const ProductContext = createContext();
{/*const ProductosContext = createContext();

export const useProductos = () => useContext(ProductosContext); */}

export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const MOCKAPI_URL = "https://68d48305214be68f8c696be9.mockapi.io/api/productos";
    const LOCAL_JSON = "data/listaProductos.json";

    useEffect(() => {
      //funcion asincrona dentro del useEffect
      const cargarProductos = async () => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);// corta a los 3 segundos
          //intento traer los datos desde mockapi
          const response = await fetch(MOCKAPI_URL, { signal: controller.signal});
          clearTimeout(timeout);

          //si responde distinto lanzo error
          if (!response.ok) {
            throw new error(`MockAPI respondio ${response.status}`);
          }

          const data = await response.json();

          //si existe data, seteo productos
          if (Array.isArray(data) && data.length > 0) {
            console.log("Productos desde MockAPI", data);
            setProductos(data);
          } else {
            //si devuelve vacio, seteo productos locales
            console.warn("MockAPI vacio - productos locales");
            const localResponse = await fetch(LOCAL_JSON);
            const localData = await localResponse.json();
            setProductos(localData);
          }
        } catch (err) {
          //si hay error cargo json local
          console.log("Error cargando MockAPI - uso local", err);
          try {
            const localResponse = await fetch(LOCAL_JSON);
            const localData = await localResponse.json();
            setProductos(localData);
          } catch (errLocal) {
            //si no puede cargar localmente, seteo vacio
            console.error("No se pudo cargar el JSON local:", errLocal);
            setProductos([]);
          }
        } finally {
          //se detiene el loading final
          setLoading(false);
        }
      };

      cargarProductos();
    }, []);

    {/*funcion busqueda de productos */}
    const searchProduct = (search) => {
      if (!search) {
        setFilteredProduct(productos);
      } else {
        const resultado = productos.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));
        setFilteredProduct(resultado)
      }
    };

    return (
        <ProductContext.Provider value={{productos, loading, error, filteredProduct, searchProduct }}>
            {children}
        </ProductContext.Provider>
    );
}