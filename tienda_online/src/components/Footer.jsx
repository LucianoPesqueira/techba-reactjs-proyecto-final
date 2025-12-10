import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Mail, ArrowUp, Send } from 'lucide-react';
import toast from "react-hot-toast"

import '../styles/components/footer.css';
import emailjs from "@emailjs/browser";
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState("");

    const scrollToTop = () => {
        navigate("/");

        setTimeout(() =>{
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 150);  
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const params = {
            user_email: email,
            subject: "¡Gracias por suscribirte a nuestra newsletter!",
            from_name: "Soporte LNP-Store",
            reply_to_email: "luchop1908@gmail.com"
        };

        emailjs
         .send(
            "service_kr8b4q5", //Service ID
            "template_9f9awqr",  //Template ID
            params,
            "n4_Oy2Rrt0UgIik2V"   //Public KEY
          )
          .then(() => {
            setMensaje("¡Te suscribiste con éxito! Revisa tu correo.");
            toast.success("¡Te suscribiste con éxito! Revisa tu correo.");
            setEmail("");
          })
          .catch(() => {
            setMensaje("Ocurrió un error. Intenta otra vez.");
            toast.error("Ocurrió un error. Intenta otra vez.");
          });
    }

    return (
        <footer aria-label='Pie de pagina' className="bg-dark text-white pt-5 pb-3"> 
            <Container>
                <Row className="mb-4">
                    
                    {/* Columna 1: Logo y Slogan (Branding) */}
                    <Col md={4} className="mb-4 flex-column justify-content-between">
                        <div>
                            <h4 className="text-info mb-1">🎮 Tienda Gamer</h4>
                            <p className="text-muted-white small">Tu próxima aventura comienza aquí.</p>
                        </div>
                        {/* Botón Volver Arriba (integrado en el diseño) */}
                        <Button 
                            variant="outline-info" 
                            onClick={scrollToTop} 
                            className="mt-3 w-100 w-md-70 mx-md-auto d-flex align-items-center justify-content-center"
                        >
                            <ArrowUp size={18} className="me-2" />
                            Inicio
                        </Button>
                    </Col>

                    {/* Columna 2: Newsletter (Suscripción) */}
                    <Col md={4} className="mb-4">
                        <h5 className="mb-3">🔥 Únete a las Ofertas</h5>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-2">
                                <Form.Control 
                                    type="email" 
                                    name="email"
                                    placeholder="Ingresa tu correo" 
                                    value={email}
                                    className="bg-dark text-white border-secondary placeholder-white"
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete='email'
                                    required
                                />
                            </Form.Group>
                            <Button type='submit' variant="info" className="w-100"> 
                                Suscribirme <Send size={16} className="ms-1" />
                            </Button>
                            {/* {mensaje && <p>{mensaje}</p>} */}
                        </Form>
                    </Col>
                    
                    {/* Columna 3: Información de Contacto */}
                    <Col md={4} className="mb-4">
                        <h5 className="mb-3">Información</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Mail size={16} className="me-2 text-info"/>
                                <span className="text-white-50">soporte@tiendaonline.com</span>
                            </li>
                            <li className="text-white-50">
                                <small>Lunes a Viernes, 9:00 AM - 6:00 PM</small>
                            </li>
                            {/* Puedes añadir un enlace rápido a políticas si lo deseas */}
                            <li className="mt-2"><a href="/politicas" className="text-decoration-none text-info small">Políticas de Privacidad</a></li>
                        </ul>
                    </Col>
                </Row>

                {/* Separador */}
                <hr className="border-secondary"/>

                {/* Fila de Copyright */}
                <Row className="pt-1">
                    <Col className="text-center">
                        <p className="text-muted-white small mb-0">
                            © {new Date().getFullYear()} Tienda Online. Todos los derechos reservados.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};