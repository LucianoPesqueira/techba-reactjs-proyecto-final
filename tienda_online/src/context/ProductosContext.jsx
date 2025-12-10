import { useContext, createContext, useEffect, useState } from 'react';

export const ProductContext = createContext();

export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const MOCKAPI_URL = "https://68d48305214be68f8c696be9.mockapi.io/api/productos";
    const LOCAL_JSON = "data/listaProductos.json";

    useEffect(() => {
      //funcion asincrona dentro del useEffect
      const loadingProducts = async () => {
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

      loadingProducts();
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

    {/*funcion generar 5 productos random */}
    const getRandomProducts = (numProducts = 5) => {
      if (productos.length === 0) return [];
      const shuffled = [...productos].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numProducts);
    };

    {/*funcion agregar nuevo producto */}
    const createProduct = async (newProduct) => {
      try {
        const response = await fetch(MOCKAPI_URL, {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify(newProduct),
        });
        const data = await response.json();
        setProductos(prev => [...prev, data]);
    } catch (err) {
        console.error("Error creando producto:", err);
      }
    };

    {/*funcion actualizar producto */}
    const updateProduct = async (id, updatedProduct) => {
      try {
        const response = await fetch(`${MOCKAPI_URL}/${id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify(updatedProduct),
        });
        const data = await response.json();
        setProductos(prev => prev.map(p => p.id === data.id ? data : p));
      } catch (err) {
        console.error("Error actualizando producto:", err);
      }
    };

    {/*funcion eliminar producto */}
    const deleteProduct = async (id) => {
      try {
        const response = await fetch(`${MOCKAPI_URL}/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProductos(prev => prev.filter(p => p.id !== id));
        } else {
          console.error("Error eliminando producto:", response.statusText);
        }
      } catch (err) {
        console.error("Error eliminando producto:", err);
      }
    };

    const value = {
      productos,
      loading,
      error,
      filteredProduct,
      searchProduct,
      getRandomProducts,
      createProduct,
      updateProduct,
      deleteProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

// hooks y context para manejar la autenticacion del usuario (login, logout, estado)
export function useProductContext() {
    const context = useContext(ProductContext);
    if (!context) throw new Error("useProductContext debe usarse dentro de un ProductoProvider");

    return context;
}