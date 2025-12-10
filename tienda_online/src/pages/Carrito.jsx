import { useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2, AlertTriangle, CreditCard, ShoppingBasket } from 'lucide-react';


import { useCarritoContext } from "../context/CarritoContext";
import { useUserContext } from '../context/UsuarioContext';
import { useDocumentHead } from "../hooks/useDocumentHead";


// Tasas de impuesto y envío (ficticias)
const TAX_RATE = 0.15; // 15% de impuesto
const SHIPPING_COST = 0; 

// Componente individual del ítem del carrito
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const subtotal = item.precio * item.cantidad;

    return (
        <li className="list-group-item d-flex flex-column flex-md-row align-items-md-center py-3 px-0 border-bottom">
            {/* Sección de Imagen y Nombre (Columna 1) */}
            <div className="d-flex align-items-center mb-2 mb-md-0 col-12 col-md-5 ms-2">
                <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="img-fluid rounded me-2" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                    <h6 className="mb-0 fw-bold">{item.nombre}</h6>
                    {/* <small className="text-muted d-block">Precio unitario: ${item.precio.toFixed(2)}</small> */}
                    <small className="text-muted d-block">Precio unitario: ${item.precio}</small>
                </div>
            </div>

            {/* Controles de Cantidad y Precio (Columna 2 y 3) */}
            <div className="d-flex align-items-center justify-content-between col-12 col-md-7">
                
                {/* Controles de Cantidad */}
                <div className="input-group input-group-sm me-2" style={{ width: '110px' }}>
                    <button 
                        className="btn btn-outline-secondary" 
                        type="button" 
                        onClick={() => onUpdateQuantity(item, - 1)}
                        disabled={item.cantidad <= 1}
                    >
                        <Minus size={14} />
                    </button>
                    <input 
                        type="text" 
                        className="form-control text-center bg-light" 
                        readOnly 
                        value={item.cantidad} 
                        style={{ maxWidth: '40px' }}
                    />
                    <button 
                        className="btn btn-outline-secondary" 
                        type="button" 
                        onClick={() => onUpdateQuantity(item, + 1)}
                    >
                        <Plus size={14} />
                    </button>
                </div>
                
                {/* Subtotal por Item */}
                <div className="text-end fw-bold me-3" style={{ minWidth: '80px' }}>
                    ${subtotal.toFixed(2)}
                </div>

                {/* Botón Eliminar */}
                <button 
                    className="btn btn-outline-danger btn-sm rounded-circle p-2 me-3" 
                    onClick={() => onRemove(item.id)}
                    title="Eliminar producto"
                    style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </li>
    );
};

// Componente de la Tarjeta de Resumen
const OrderSummary = ({ subtotal, total, onEmptyCart, onCheckout }) => (
    <div className="card shadow-sm rounded-4 border-0">
        <div className="card-header bg-primary text-white fw-bold fs-5 rounded-top-4">
            Resumen del Pedido
        </div>
        <div className="card-body p-4">
            {/* Fila de Subtotal */}
            <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-semibold">${subtotal.toFixed(2)}</span>
            </div>
            
            {/* Fila de Envío */}
            <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Costo de Envío:</span>
                <span className="fw-semibold">${SHIPPING_COST.toFixed(2)}</span>
            </div>
            
            {/* Fila de Impuestos */}
            <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                <span className="text-muted">Impuestos ({Math.round(TAX_RATE * 100)}%):</span>
                <span className="fw-semibold">${(subtotal * TAX_RATE).toFixed(2)}</span>
            </div>
            
            {/* Total Final */}
            <div className="d-flex justify-content-between fw-bold fs-4 text-dark mb-4">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>

            {/* Botones de Acción */}
            <div className="d-grid gap-2">
                <button 
                    className="btn btn-success btn-lg shadow-sm d-flex align-items-center justify-content-center" 
                    onClick={onCheckout}
                >
                    <CreditCard size={20} className="me-2" />
                    Proceder al Pago
                </button>
                <button 
                    className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center mt-2" 
                    onClick={onEmptyCart}
                >
                    <Trash2 size={16} className="me-2" />
                    Vaciar Carrito
                </button>
            </div>
        </div>
    </div>
);


// Componente principal del Carrito de Compras
export default function Carrito() {

    {/* SEO - Carrito */}
    useDocumentHead({
        title: "Carrito de Compras - LNP Store",
        description: "Revisa los productos en tu carrito de compras, ajusta cantidades y procede al pago.",
        keywords: "carrito de compras, tienda online, productos, pago"
    });

    const {carrito, actualizarCantidad , borrarProducto, vaciarCarrito, total} = useCarritoContext();
    const { user }  = useUserContext();
    const navigate = useNavigate();

    // 1. Lógica para manejar la actualización de la cantidad
    const handleUpdateQuantity = (producto, delta) => {
        const item = carrito.find(p => p.id === producto.id);

        if (!item) return;

        const nuevaCantidad = item.cantidad + delta;

        if (nuevaCantidad < 1) {
            borrarProducto(producto.id); // Si la cantidad es 0, lo elimina
        } else {
            actualizarCantidad(producto, delta);
        }
    };

    // 2. Lógica para eliminar un ítem
    const handleRemoveItem = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto del carrito?")) {
            borrarProducto(id);
        }
    };

    // 3. Lógica para vaciar el carrito
    const handleEmptyCart = () => {
        if (window.confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
            vaciarCarrito();
        }
    };

    // 4. Lógica para proceder al pago
    const handleCheckout = () => {
        if (!user) {
            navigate('/iniciarSesion', { state : { from: '/pagar'}});
            return;
        }
        alert("¡Procesando pago! (Esta es una simulación)");
        navigate('/pagar');
    };

    // 5. Cálculo de totales (usando useMemo para optimización)
    const { subtotal, totalFinal } = useMemo(() => {
        const cartSubtotal = total;
        const taxAmount = cartSubtotal * TAX_RATE;
        const finalTotal = cartSubtotal + taxAmount + SHIPPING_COST;

        return {
            subtotal: cartSubtotal,
            totalFinal: finalTotal,
        };
    }, [carrito]); // Recalcular solo si los ítems del carrito cambian

    const isCartEmpty = carrito.length === 0;

    return (
        <div className="container-fluid py-4 px-3 px-lg-5">{/*que tan arriba esta todo el carrito */}
            {/* ------------------- FILA 1: TÍTULO ------------------- */}
            <div className="row"> 
                <div className="col-12">
                    <h1 className="display-5 fw-bold mb-4 d-flex align-items-center justify-content-center text-center">
                        <ShoppingBasket size={36} className="me-3 text-primary" />
                        Tu Carrito de Compras
                    </h1>
                </div>
            </div>          
            {/* ------------------- FILA 2: CONTENIDO ------------------- */}
            <div className="row g-4"> 
                {isCartEmpty ? (
                    <div className="col-12 d-flex justify-content-center">
                        <div className="alert alert-warning d-flex align-items-center p-4 rounded-4" role="alert" style={{ maxWidth: '550px' }}>
                            <AlertTriangle size={24} className="me-3 flex-shrink-0" />
                            <div>
                                ¡Tu carrito está vacío! Agrega algunos productos para continuar.
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Columna de Items del Carrito (8 columnas) */}
                        <div className="col-lg-8">
                            <div className="card shadow-sm rounded-4">
                                <ul className="list-group list-group-flush">
                                    {/* Encabezados de la Tabla */}
                                    <li className="list-group-item bg-light d-none d-md-flex fw-semibold text-muted py-3 px-0">
                                        <div className="col-5 ps-3">Producto</div>
                                        <div className="col-2 text-center">Cantidad</div>
                                        <div className="col-4 text-center">Subtotal</div>
                                        <div className="col-1 text-center pe-3"></div> 
                                    </li>
                                    {/* Mapeo sobre el estado cartItems */}
                                    {carrito.map(item => (
                                        <CartItem 
                                            key={item.id} 
                                            item={item} 
                                            onUpdateQuantity={handleUpdateQuantity} 
                                            onRemove={handleRemoveItem} 
                                        />
                                    ))}
                                </ul>
                                <div className="card-footer bg-white text-end rounded-bottom-4">
                                    <span className="text-muted">Total de artículos: </span>
                                    <span className="fw-bold">{carrito.reduce((acc, item) => acc + item.cantidad, 0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Columna del Resumen del Pedido (4 columnas) */}
                        <div className="col-lg-4">
                            <OrderSummary 
                                subtotal={subtotal} 
                                total={totalFinal}
                                onEmptyCart={handleEmptyCart}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    </>
                )}
            </div>       
        </div>
    );
}