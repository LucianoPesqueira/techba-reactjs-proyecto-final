import React from "react";
import {createContext, useContext, useState, useEffect} from "react";

const CarritoContext = createContext();

export function CarritoProvider({children}) {
  
    //inicializo el carrito desde el localStorage si existe
    const [carrito, setCarrito] = useState(() => {
        const guardado = localStorage.getItem("carrito");
        return guardado ? JSON.parse(guardado) : [];
    });

    //actualizo el localStorage cada vez que cambia el carrito
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    //agregar un producto al carrito
    const agregarAlCarrito = (producto, cantidad) =>{
      const exists = carrito.some(item => item.id === producto.id);

      if (!exists) {
        setCarrito([...carrito, {...producto, cantidad}]);
      } else {
        const nuevoCarrito = carrito.map(item => {
          if (item.id === producto.id) {
            return {...item, cantidad: item.cantidad + cantidad};
          } else {
            return item;
          }
        });

        setCarrito(nuevoCarrito);
      }
    }

    //quitar una unidad de un producto del carrito
    const quitarCantidad = (id) => {
      const nuevoCarrito = carrito.map(item => {
        if (item.id === id && item.cantidad > 1) {
          return {...item, cantidad: item.cantidad - 1};
        } else {
          return item;
        }
      }
    ).filter(item => item.cantidad > 0);

      setCarrito(nuevoCarrito);
    }; 

    //agregar una unidad de un producto del carrito
    const agregarCantidad = (id) => {
      const nuevoCarrito = carrito.map(item => {
        if (item.id === id) {
          return {...item, cantidad: item.cantidad + 1};
        } else {
          return item;
        }
      });

      setCarrito(nuevoCarrito);
    }

    //funcion actualizarCantidad recibiendo el producto y el +1 o -1
    const actualizarCantidad = (producto, delta) => {
      const nuevoCarrito = carrito.map(item => {
        if (item.id === producto.id) {
          const nuevaCantidad = item.cantidad + delta;
          return {...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1};
        } else {
          return item;
        }
      });

      setCarrito(nuevoCarrito);
    }

    //borrar un producto del carrito
    const borrarProducto = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
    };

    //vaciar todo el carrito
    const vaciarCarrito = () => setCarrito([]);

    //calculo el total del carrito
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);


    const value = {
      carrito,
      agregarAlCarrito,
      borrarProducto,
      vaciarCarrito,

      //modificar cantidades
      actualizarCantidad,

      //mostrar total
      total
    }

    return (
        <CarritoContext.Provider value={ value } >
            {children}
        </CarritoContext.Provider>
    );
}

export function useCarritoContext() {
    //return useContext(CarritoContext);
    const context = useContext(CarritoContext);
    if (!context) throw new Error("useCarritoContext debe usarse dentro de un CarritoProvider");
    
    return context;
}