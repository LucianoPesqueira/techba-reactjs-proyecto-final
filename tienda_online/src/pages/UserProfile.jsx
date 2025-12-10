import React from 'react'
import { useState } from 'react';
import '../styles/pages/userprofile.css'
import { Accordion, Button, Form, InputGroup } from 'react-bootstrap';
import { useUserContext } from '../context/UsuarioContext';

import userImage from '../assets/img/user-account.png';
import { Navigate } from 'react-router-dom';

export default function UserProfile() {
    const { user, logout, isAuthenticated } = useUserContext();

    const [activeForm, setActiveForm] = useState('perfil');

    const handleLogout = () => {
        logout();
        // Navigate("/");
    };

  return (
    <div className='container-profile'>
        <div className="profile">
            <div className="profile-header">
                <img src={userImage} alt="" className="profile-img" />
                <div className="profile-text-container">       
                    <h1 className="profile-title">Perfil Usuario</h1>
                    <p className="profile-email">
                        {isAuthenticated ? user.email : "user@email.com"}
                    </p>
                </div>
            </div>

            <div className="menu">
                <Button onClick={() => setActiveForm("perfil")} className={`menu-link ${activeForm === "perfil" ? "btn-active" : ""}`}>
                    <i className="fa-solid fa-user-pen menu-icon"></i>
                    Perfil
                </Button>
                <Button onClick={() => setActiveForm("compras")} className={`menu-link ${activeForm === "compras" ? "btn-active" : ""}`}>
                    <i className="fa-solid fa-basket-shopping menu-icon"></i>
                    Compras
                </Button>
                <button onClick={() => setActiveForm("salir")} className={`menu-link ${activeForm === "salir" ? "btn-active" : ""}`}>
                    <i className="fa-solid fa-right-from-bracket menu-icon"></i>
                    Sesion
                </button>
            </div>
        </div>
        {/*---------------------------------PERFIL--------------------------------- */}
        {activeForm === 'perfil' && (
        <form className="account">
            <div className="account-header">
                <h1 className="account-title">Perfil</h1>
                <h2>Proximamente...</h2>
                <div className="btn-container">
                    <button className="btn-cancel" disabled>Cancelar</button>
                    <button className="btn-save" disabled>Guardar</button>
                </div>              
            </div>

            <div className="account-edit">
                <Form.Group className='input-container'>
                    <Form.Label htmlFor="name">Nombre</Form.Label>
                        <InputGroup>
                            <Form.Control
                                id='name'
                                type='text'
                                name='name'
                                placeholder='nombre'
                                required
                                autoComplete='name'
                            />
                        </InputGroup>
                </Form.Group>
                <Form.Group className='input-container'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                        <InputGroup>
                            <Form.Control
                                id='email'
                                type='text'
                                name='email'
                                placeholder='email'
                                required
                                autoComplete='email'
                            />
                        </InputGroup>
                </Form.Group>
            </div>

            <div className="account-edit">
                <Form.Group className='input-container'>
                    <Form.Label htmlFor='currentPassword'>Contraseña Actual</Form.Label>
                        <InputGroup>
                            <Form.Control
                                id='currentPassword'
                                type='password'
                                name='currentPassword'
                                placeholder='Contraseña actual'
                                required
                                autoComplete='current-password'
                            />
                        </InputGroup>
                </Form.Group>
                <Form.Group className='input-container'>
                    <Form.Label htmlFor='newPassword'>Nueva Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                id='newPassword'
                                type='password'
                                name='newPassword'
                                placeholder='Nueva contraseña'
                                required
                                autoComplete='new-password'
                            />
                        </InputGroup>
                </Form.Group>
            </div>
        </form>
        )}

        {/*---------------------------------COMPRAS--------------------------------- */}
        {activeForm === 'compras' && (
            <div className="shopping-list">
                <div className="shopping-header">
                    <h1 className="shopping-title">Compras</h1>
                    <h2>Proximamente...</h2>
                </div>

                <div className="shopping-items">
                    <Accordion flush>
                        {/*logica map de compras */}
                        <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <div className='d-flex align-items-center'>
                                <img
                                    src='ruta/mi_imagen.jpg'
                                    alt='producto'
                                    className='shopping-product-img me-3'/>
                                <div>
                                    <strong>compra.nombre</strong>
                                    <div className='text-muted'>
                                        Fecha: compra.fecha
                                    </div>
                                </div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <p><strong>Precio: $</strong></p>
                            <p><strong>Cantidad: </strong></p>
                            <p><strong>Total: $</strong></p>
                          Detalles de la compra del producto.
                        </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        )}

        {/*---------------------------------SALIR--------------------------------- */}
        {activeForm === 'salir' &&(
            <form className="account-logout">
                <div className="logout-header">
                    <h1 className="logout-title">Cerrar Sesion</h1>
                </div>

                <div className="logout-content">
                    <div className="input-container">
                        <label htmlFor="">¿Seguro que desea cerrar sesion?</label>
                    </div>
                    <div className="input-container">
                        {/* <Button variant='link' size='md' className='text-white ms-2 card-user-logout' onClick={handleLogout}>Salir</Button> */}
                        <Button className='btn-logout' onClick={handleLogout}>Cerrar Sesion</Button>
                    </div>
                </div>
            </form>
        )}

    </div>//fin container
  );
};