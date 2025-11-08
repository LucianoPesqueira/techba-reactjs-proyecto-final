import { useUserContext } from "../context/UsuarioContext";
import { Navigate } from "react-router-dom";


// Componente de ruta protegida que verifica si el usuario está autenticado y es admin
export default function RutaProtegida({ children }) {
    const { isAuthenticated, isAdmin } = useUserContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // redirige al login si no está autenticado
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />; // redirige a inicio si no es admin
    }

    return children; 
};