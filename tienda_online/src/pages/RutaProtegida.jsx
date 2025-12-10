import { useUserContext } from "../context/UsuarioContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast"
import { useEffect } from "react";

//Componente de ruta protegida que verifica si el usuario está autenticado y es admin
export default function RutaProtegida({ children, soloAdmin = false }) {
    const { isAuthenticated, isAdmin, loadingAuth, justLoggedOut } = useUserContext();

    useEffect(() => {
        if (!loadingAuth && !isAuthenticated && !justLoggedOut) {
            toast.error("Debes iniciar sesion para acceder a esta seccion!");
        } 

        if (!loadingAuth && soloAdmin && !isAdmin) {
            toast.error("No tienes permisos de administrador para acceder!");
        }
    }, [loadingAuth, isAuthenticated, isAdmin, soloAdmin, justLoggedOut]);

    if (loadingAuth) {
        return <div className="loading-auth">Cargando...</div>;
    }

    // Si no está autenticado, redirige a iniciar sesión
    if (!isAuthenticated) {
        return <Navigate to="/iniciarSesion" replace />; 
    }

    // Si la ruta es solo para admin y el usuario no es admin, redirige a inicio
    if (soloAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children; 
};