import { useEffect, useState } from 'react'
import { Container, Form, FormGroup, Row, Col, Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom';

import { useUserContext } from '../context/UsuarioContext';
import { useDocumentHead } from "../hooks/useDocumentHead";

function Login() {

    {/* Title/noindex - inicio sesion */}
    useDocumentHead({
        title: "LNP Store - Iniciar Sesion",
        meta: [{
            name: "robots",
            content: "noindex, nofollow"
            }]
    });

    const [nombre, setNombre] = useState('');
    const [contrasena, setContrasena] = useState('');
    const { loadingUser, errorUser, setErrorUser, login, isAuthenticated } = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/'; //ruta a la que redirigir despues del login

    const clearError = () => setErrorUser(null);

    
    const handleChange = (e) => {
        clearError();
        const { name, value} = e.target;
        
        if (name === "nombre") {
            setNombre(value);
        } else if (name === "contrasena") {
            setContrasena(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login({ nombre, contrasena });
        if (!success) {
            setNombre('');
            setContrasena('');
        }
    };



    //si ya esta logueado, redirijo con from
    useEffect(() => {
        if (isAuthenticated) navigate(from);
    }, [isAuthenticated, navigate, from]);

    //del context usuario obtengo los nombres de estado
    if(loadingUser) return <p>Cargando Usuario...</p>;


    return (
        <Container className="d-flex justify-content-center align-items-center">

            <Form onSubmit={handleSubmit}>
                <h3>Iniciar Sesion</h3>
                <FormGroup as={Row} className='mb-3' controlId="formNombre">
                    <Form.Label column sm="2" className="col-form-label-sm">
                    Usuario
                    </Form.Label>
                    <Col sm={12}>
                    <Form.Control 
                        type="text"
                        name="nombre"
                        value={nombre}
                        placeholder="usuario1"
                        required
                        autoComplete='username'
                        // onChange={(e) => {
                        //     setNombre(e.target.value);
                        //     if (errorUser) setErrorUser(null);
                        // }}
                        onChange={handleChange}
                    />
                    </Col>
                </FormGroup>

                <FormGroup as={Row} className='mb-3' controlId="formContrasena">
                    <Form.Label column sm="2" className="col-form-label-sm">
                    Contraseña
                    </Form.Label>
                    <Col sm={12}>
                    <Form.Control 
                        type="password"
                        name="contrasena"
                        value={contrasena}
                        placeholder="contraseña"
                        required
                        autoComplete='current-password'
                        // onChange={(e) => {
                        //     setContrasena(e.target.value);
                        //     if (errorUser) setErrorUser(null);
                        // }}
                        onChange={handleChange}
                    />
                    </Col>
                </FormGroup>

                <p className=''>user: user1 - 1234</p>
                <p className=''>admin: lucianoadmin - admin123</p>

                <div className="d-grid gap-2">
                {errorUser && (
                    <p className='text-danger small mt-2'>{errorUser}</p>
                )}
                <Button variant="primary" type="submit" value="send" size="sm">
                    Log In
                </Button>
                </div>

            </Form>
        </Container>
    );

} export default Login;


