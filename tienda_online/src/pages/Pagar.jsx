import { useState } from 'react';
import { useNavigate } from "react-router-dom";
// Íconos de Lucide-React
import { CreditCard, ArrowLeft, Receipt, CheckCircle, Home, ArrowRight } from 'lucide-react'; 

import { useCarritoContext } from "../context/CarritoContext";
import { useDocumentHead } from '../hooks/useDocumentHead';


// --- Componente de Flujo de Pago (Checkout) ---
const Checkout = ({ total, onBackToCart, onOrderSuccess }) => {
    const totalFinal = total * 1.15;
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [montoFinal, setMontoFinal] = useState(0);

    const steps = [
        //{ id: 1, name: 'Envío', icon: MapPin },
        { id: 1, name: 'Pago', icon: CreditCard },
        { id: 2, name: 'Revisión', icon: Receipt },
    ];
    const { vaciarCarrito } = useCarritoContext();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (step === 1) {
            setStep(step + 1);

        } else if (step === 2) {
            // Último paso (Revisión): procesar la compra
            setIsProcessing(true);
            setMontoFinal(totalFinal);
            console.log("Procesando compra por un total de: " + totalFinal.toFixed(2));
            
            // Simulación de procesamiento asíncrono (3 segundos)
            setTimeout(() => {
                //limpio el carrito antes de pasar a la pantalla final
                vaciarCarrito();

                setIsProcessing(false);
                setStep(3); // Transiciona a la vista de éxito
            }, 3000);
        }
    };

    const CurrentIcon = steps.find(s => s.id === step)?.icon || CreditCard;

    const renderStepContent = () => {
        switch (step) {
            // case 1:
            //     return (
            //         <div className="p-4">
            //             <h5 className="mb-4 text-primary">1. Información de Envío <Truck size={20} className="ms-2 text-muted" /></h5>
            //             <div className="row g-3">
            //                 <div className="col-md-6"><input type="text" className="form-control" placeholder="Nombre completo" required /></div>
            //                 <div className="col-md-6"><input type="email" className="form-control" placeholder="Correo electrónico" required /></div>
            //                 <div className="col-12"><input type="text" className="form-control" placeholder="Dirección Línea 1" required /></div>
            //                 <div className="col-12"><input type="text" className="form-control" placeholder="Dirección Línea 2 (Opcional)" /></div>
            //                 <div className="col-md-6"><input type="text" className="form-control" placeholder="Ciudad" required /></div>
            //                 <div className="col-md-3"><input type="text" className="form-control" placeholder="Estado/Provincia" required /></div>
            //                 <div className="col-md-3"><input type="text" className="form-control" placeholder="Código Postal" required /></div>
            //             </div>
            //         </div>
            //     );
            case 1:
                return (
                    <div className="p-4">
                        <h5 className="mb-4 text-primary">1. Detalles de Pago <CreditCard size={20} className="ms-2 text-muted" /></h5>
                        <div className="row g-3">
                            <div className="col-12"><input type="text" className="form-control" placeholder="Número de Tarjeta" required /></div>
                            <div className="col-md-6"><input type="text" className="form-control" placeholder="Nombre en la Tarjeta" required /></div>
                            <div className="col-md-3"><input type="text" className="form-control" placeholder="MM/AA" required /></div>
                            <div className="col-md-3"><input type="text" className="form-control" placeholder="CVV" required /></div>
                            <div className="col-12 mt-4">
                                <p className="text-muted small">Al hacer clic en "Pagar", aceptas nuestros términos y condiciones.</p>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="p-4">
                        <h5 className="mb-4 text-primary">2. Revisión Final <Receipt size={20} className="ms-2 text-muted" /></h5>
                        <p className="text-muted">Verifica los detalles de tu orden antes de completar la compra.</p>
                        <div className="p-3 bg-light rounded-3 border">
                            <h3 className="fw-bold text-dark mb-2">Total a Pagar:</h3>
                            <h1 className="fw-bold text-success">${totalFinal.toFixed(2)}</h1>
                            <p className='small text-muted mb-0'>El método de pago se evaluara y se acreditara de inmediato.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // VISTA DE ÉXITO (Paso 3)
    if (step === 3) {
        return (
             <div className="container-fluid py-5 px-3 px-lg-5 min-vh-100 d-flex align-items-center">
                <div className="row justify-content-center w-100">
                    <div className="col-lg-8 col-xl-6">
                        <div className="card shadow-lg rounded-4 border-0">
                            <div className="p-5 text-center bg-white rounded-4">
                                <CheckCircle size={80} className="text-success mb-4 mx-auto" />
                                <h2 className="fw-bold text-success mb-3">¡Pedido Confirmado!</h2>
                                <p className="lead text-muted">Tu orden por un total de <span className='fw-bold text-primary'>${montoFinal.toFixed(2)}</span> ha sido procesada con éxito.</p>
                                <p className="text-muted mb-4">Recibirás una confirmación por correo electrónico con los detalles de la compra.</p>
                                <button 
                                    className="btn btn-primary btn-lg mt-3 shadow-lg d-flex align-items-center justify-content-center mx-auto"
                                    onClick={onOrderSuccess} 
                                >
                                    <Home size={20} className="me-2" />
                                    Continuar Comprando
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // VISTAS DE PAGO (Pasos 1, 2)
    return (
        <div className="container-fluid py-4 px-3 px-lg-5">
            <div className="row mb-4">
                <div className="col-12">
                    <button 
                        className="btn btn-link text-primary p-0 d-flex align-items-center mb-3"
                        onClick={onBackToCart}
                        disabled={isProcessing}
                    >
                        <ArrowLeft size={20} className="me-2" /> Volver al Carrito
                    </button>
                    <h1 className="display-6 fw-bold text-center d-flex align-items-center justify-content-center">
                        <CurrentIcon size={30} className="me-3 text-primary" />
                        Finalizar Compra
                    </h1>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    
                    {/* Indicador de Pasos */}
                    <div className="d-flex justify-content-between mb-4 px-lg-5" style={{ position: 'relative' }}>
                        <div className="position-absolute top-50 start-0 w-100 h-1 bg-light rounded" style={{ height: '3px', zIndex: 0 }}></div>
                        {steps.map(s => (
                            <div key={s.id} className="text-center" style={{ zIndex: 1 }}>
                                <div className={`d-flex align-items-center justify-content-center rounded-circle mb-2 shadow ${
                                    s.id === step ? 'bg-primary text-white' : 
                                    s.id < step ? 'bg-success text-white' : 
                                    'bg-light text-muted'
                                }`} 
                                style={{ width: '40px', height: '40px', margin: '0 auto' }}>
                                    <s.icon size={20} />
                                </div>
                                <small className={`fw-semibold ${s.id === step ? 'text-primary' : 'text-muted'}`}>{s.name}</small>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="card shadow-lg rounded-4 border-0">
                        <div className="card-body p-0">
                            {renderStepContent()}
                        </div>
                        <div className="card-footer bg-light d-flex justify-content-between rounded-bottom-4 p-3">
                            {step > 1 && (
                                <button 
                                    type="button" 
                                    className={`btn btn-outline-secondary ${isProcessing ? 'disabled' : ''}`} 
                                    onClick={() => setStep(step - 1)}
                                    disabled={isProcessing}
                                >
                                    <ArrowLeft size={16} className="me-2" /> Anterior
                                </button>
                            )}
                            
                            <button
                                type="submit"
                                className={`btn btn-primary ms-auto d-flex align-items-center ${isProcessing ? 'disabled' : ''}`}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        {step === 2 ? (
                                            <>
                                                <Receipt size={16} className="me-2" /> Confirmar Pedido
                                            </>
                                        ) : (
                                            <>
                                                Siguiente <ArrowRight size={16} className="ms-2 rotate-180" />
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default function Pagar() {

    {/* SEO - Pagar */}
    useDocumentHead({
        title: 'Pagar - LNP Store',
        description: 'Finaliza tu compra de productos tecnológicos en LNP Store. Proceso de pago seguro y rápido.',
        keywords: 'pagar, checkout, tienda online, productos tecnológicos',
    });

    const {vaciarCarrito, total} = useCarritoContext();
    const navigate = useNavigate();


    {/*funcion de devuelve al carrito */}
    const handleBackToCart = () => {
        navigate('/carrito');
    };

    {/*funcion que redirige a productos */}
    const handleOrderSuccess = () => {
        vaciarCarrito();
        //localStorage.removeItem(carrito);
        navigate('/productos');  
    };


  return (
    <div className="bg-light min-vh-100">
        <Checkout
            total={total} //envio el total del CarritoContext
            onBackToCart={handleBackToCart} //regreso al carrito 
            onOrderSuccess={handleOrderSuccess} //vaciar carrito(context-localStorage) y navego a productos
        />
    </div>
  );
};
