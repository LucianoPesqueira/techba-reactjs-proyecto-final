import { createContext, useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";

export const UserContext = createContext();

export const UsuarioProvider = ({children}) => {
    const [user, setUser] = useState(null); // null = no logueado
    const [loadingUser, setLoadingUser] = useState(false);
    const [errorUser, setErrorUser] = useState(null);
    const MOCKAPI_URL = "https://68d48305214be68f8c696be9.mockapi.io/api/usuarios";
    const LOCAL_JSON = "data/listaUsuarios.json";

    useEffect(() => {
      //al cargar el context, verifico si hay un usuario en localStorage
      const storedtoken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (storedtoken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);


    const login = async({ nombre, contrasena}) => {
      setLoadingUser(true);
      let usuarioEncontrado = null;
      let response;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        
        // Intento obtener usuarios desde MockAPI
        response = await fetch(MOCKAPI_URL, { signal: controller.signal});
        clearTimeout(timeout);
        
        //obtengo otra respuesta que no sea ok
        if (!response.ok) throw new Error(`MockAPI respondio ${response.status}`);

        //si todo ok, obtengo los datos
        const data = await response.json();

        //busco el usuario en los datos obtenidos del MockAPI
        if (Array.isArray(data) && data.length > 0) {
          usuarioEncontrado = data.find((u) => u.nombre === nombre && u.contrasena === contrasena);
          const fakeToken = `fake-token-${usuarioEncontrado.nombre}`;
          localStorage.setItem("authToken", fakeToken);
          localStorage.setItem("authUser", JSON.stringify(usuarioEncontrado));
        }

        //Si no lo encontro en MockAPI, busco en el JSON local
        if(!usuarioEncontrado) {
          const localResponse = await fetch(LOCAL_JSON);
          const localData = await localResponse.json();

          //obtengo el usuario del JSON local
          usuarioEncontrado = localData.find((u) => u.nombre === nombre && u.contrasena === contrasena);
          const fakeToken = `fake-token-${usuarioEncontrado.nombre}`;
          localStorage.setItem("authToken", fakeToken);
          localStorage.setItem("authUser", JSON.stringify(usuarioEncontrado));
        }
        
        //seteo el usuario del MockAPI o JSON local (o null si no lo encontro)
        if (usuarioEncontrado) {
          setUser(usuarioEncontrado);
        } else {
          console.warn("Usuario no encontrado");
          setUser(null);
        }
      } catch (err) {
        console.log("Error al cargar usuarios:", err);
        setErrorUser(err.message || "Error al cargar usuarios");
        
        //intento cargar desde el JSON local si fallo MockAPI
        try {
          const localResponse = await fetch(LOCAL_JSON);
          const localData = await localResponse.json();

          usuarioEncontrado = localData.find((u) => u.nombre === nombre && u.contrasena === contrasena);
          const fakeToken = `fake-token-${usuarioEncontrado.nombre}`;
          localStorage.setItem("authToken", fakeToken);
          localStorage.setItem("authUser", JSON.stringify(usuarioEncontrado));

          setUser(usuarioEncontrado || null);
        } catch (errLocal) {
          console.error("No se pudo cargar el JSON local:", errLocal);
          setErrorUser(errLocal.message || "No se pudo cargar el JSON local");
          setUser(null);
        }
      } finally {
        setLoadingUser(false);
      }
    };

    const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setUser(null);
      Navigate("/productos");
    };

    const value = {
      user, 
      loadingUser,
      errorUser,
      login,
      logout,
      isAuthenticated: !!user, // true si user no es null
      isAdmin: user?.is_admin === true // true si el usuario es admin
    }

    return (
        <UserContext.Provider value={ value }>
            {children}
        </UserContext.Provider>
    );
};

// hooks y context para manejar la autenticacion del usuario (login, logout, estado)
export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUserContext debe usarse dentro de un UsuarioProvider");

    return context;
}