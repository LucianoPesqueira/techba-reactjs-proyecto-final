import { useState } from 'react'
import { Form, Button, Container, Row, Col, Card, InputGroup } from 'react-bootstrap'
import { User, Mail, MessageSquare } from 'lucide-react';
import emailjs from "@emailjs/browser";
import { useDocumentHead } from '../hooks/useDocumentHead';

import "../styles/pages/contacto.css"

function Contacto() {
  {/* SEO - Contacto */}
  useDocumentHead({
    title: "LNP Store - Contacto",
    description: "¿Tienes preguntas o necesitas ayuda? Contáctanos en LNP Store. Consultas sobre nuestros productos y servicios.",
  });
  const [formData, setFormData] = useState({name:"", email:"", message:""})

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = {
        user_name: formData.name,     //nombre cliente
        user_email: formData.email,  //email del cliente
        user_message: formData.message, //asunto 
        from_name: "Soporte LNP-Store",         //nombre remitente
        reply_to_email: "luchop1908@gmail.com" //email personal
    };

    emailjs
      .send(
        "service_kr8b4q5", //Service ID
        "template_al6b3ik",  //Template ID
        params,
        "n4_Oy2Rrt0UgIik2V"   //Public KEY
      )
        .then((response) => {
          alert("Formulario enviado exitosamente! ✅")
          console.log("Formulario enviado exitosamente!✅", response);
          setFormData({name:"", email:"", message:""})
        })
        .catch((error) => {
          alert("Error, hubo un problema al enviar el email")
          console.log("Error al enviar el formulario: ", error);
        })        
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg p-3">
            <Card.Body>
              <Card.Title as="h2" className="text-center mb-4">
                Contáctanos
              </Card.Title>
              
              <Form onSubmit={handleSubmit}>
                
                {/* Campo Nombre */}
                <Form.Group className="mb-3" controlId="formNombre">
                  <Form.Label>Nombre</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <User size={20} /> {/* Icono de Usuario */}
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      placeholder="Ingresa tu nombre" 
                      required
                      onChange={handleChange}
                      autoComplete='name'
                    />
                  </InputGroup>
                </Form.Group>

                {/* Campo Email */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Mail size={20} /> {/* Icono de Correo */}
                    </InputGroup.Text>
                    <Form.Control 
                      type="email"
                      name="email"
                      value={formData.email}
                      placeholder="ejemplo@dominio.com" 
                      required 
                      onChange={handleChange}
                      autoComplete='email'
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    No compartiremos tu email con nadie.
                  </Form.Text>
                </Form.Group>

                {/* Campo Contacto (Mensaje/TextArea) */}
                <Form.Group className="mb-4" controlId="formContacto">
                  <Form.Label>Mensaje</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={{ alignSelf: 'start', paddingTop: '0.75rem' }}>
                      <MessageSquare size={20} /> {/* Icono de Mensaje */}
                    </InputGroup.Text>
                    <Form.Control 
                      as="textarea" 
                      rows={4} 
                      name="message"
                      value={formData.message}
                      aria-label="With textarea"
                      placeholder="Escribe tu mensaje aquí..." 
                      required 
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Botón de Envío */}
                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" size="lg">
                    Enviar Mensaje
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

  )
}

export default Contacto