import { Link, useLocation } from "react-router-dom";

import "../styles/components/breadcrumb.css"

export default function Breadcrumb({ categoria, plataforma, productoNombre }) {

    const location = useLocation();

    const esPlataforma = location.pathname.includes('/plataforma/');
    const esCategoria = location.pathname.includes('/categoria/');

    const categoriaPrincipal = Array.isArray(categoria) ? categoria[0] : categoria;

    return (
        
        <nav className="breadcrumb">
            <Link to="/">Inicio</Link> 

            {/* si estoy viendo categoria */}
            {esCategoria && categoriaPrincipal && (
                <span>
                    {" > "}
                    <Link to={`/categoria/${categoriaPrincipal}`}>{categoriaPrincipal}</Link>
                </span>
            )}

            {/* si estoy viendo plataforma */}
            {esPlataforma && plataforma && (
                <span>
                    {" > "}
                    <Link to={`/plataforma/${plataforma}`}>{plataforma}</Link>
                </span>
            )}
            
            {/* estoy en detalleProducto */}
            {!esCategoria && !esPlataforma && categoriaPrincipal && (
                <span>
                    {" > "}
                    <Link to={`/categoria/${categoriaPrincipal}`}>{categoriaPrincipal}</Link>
                </span>
            )}

            {!esCategoria && !esPlataforma && plataforma && (
                <span>
                    {" > "}
                    <Link to={`/plataforma/${plataforma}`}>{plataforma}</Link>
                </span>
            )}

            {productoNombre && (
                <span>{" > "}{productoNombre}</span>
            )}
        </nav>
    );
}



// return (
        
//         <nav className="breadcrumb">
//             <Link to="/">Inicio</Link> 

//             {/* Si hay plataforma, la muestra; si no, muestra categorías */}
//             {categorias.length > 0 && (
//                 <span>
//                     {" > "}
//                     <Link to={`/categoria/${categorias[0]}`}>{categorias[0]}</Link>
//                 </span>
//             )}
//             {!categorias?.length && plataformas.length > 0 && (
//                 <span>
//                     {" > "}
//                     <Link to={`/plataforma/${plataformas[0]}`}> {plataformas[0]}</Link>
//                 </span>
//             )}
//             {productoNombre && <span>{" > "}{productoNombre}</span>}
//         </nav>
//     );