import { createContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const[auth, setAuth] = useState({})

        return (
            <AuthContext.Provider value={{auth, setAuth}}>  {/*Passes auth and setAuth to the children of AuthProvider. Shown in main.jsx */}
                {children}
            </AuthContext.Provider>
        )
}

export default AuthContext;