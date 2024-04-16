import { useState, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [autenticado, setAutenticado] = useState(false)

    const handleSetAutenticado = () => {
        setAutenticado(!autenticado)
    }

    return (
        <AuthContext.Provider
            value={{
                autenticado,
                handleSetAutenticado
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext
