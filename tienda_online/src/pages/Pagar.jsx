import React, { useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { useCarritoContext } from "../context/CarritoContext";
import { UserContext } from '../context/UsuarioContext';

function Pagar() {
    const { carrito, vaciarCarrito, total} = useCarritoContext();
    const { user }  = useContext(UserContext);
    const navigate = useNavigate();


    const comprar =() => {
        if (!user) {
            navigate('/login', { state : { from: '/pagar'}});
            return;
        } 
        alert("!Compra realizada con exito!");
        vaciarCarrito();
        localStorage.removeItem(carrito);
        navigate('/productos');
        };

  return (
    <>
        {carrito.map((p) => (
            <div key={p.id}>
                {p.nombre} (${p.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}) * {p.cantidad}
            </div>
        ))}
        <hr />{/*linea separadora */}
        <p>Total: ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
        <button onClick={comprar}>Pagar</button>
    </>
  )
}

export default Pagar