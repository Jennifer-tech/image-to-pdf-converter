import { createContext, useEffect, useState } from "react";
import netlifyIdentity from 'netlify-identity-widget'

const AuthContext = createContext({
    user: null,
    login: () => {  },
    logout: () => { },
    authReady: false 
})

export const AuthContextProvider = ({ children }) => {

    let savedUser = JSON.parse(localStorage.getItem("user"))
    
    const [user, setUser] = useState(savedUser)
    const [authReady, setAuthReady] = useState(false)

    useEffect(() => {
        netlifyIdentity.on('login', (user) => {
            setUser(user)
            localStorage.setItem('user', JSON.stringify(user)) //local storage only accepts strings
            netlifyIdentity.close()
        })

        netlifyIdentity.on('logout', () => {
            setUser(null)
        })

        netlifyIdentity.on('init', (user) => {
            setUser(user)
            setAuthReady(true)
        })

        netlifyIdentity.init()

        return () => {
            netlifyIdentity.off('login')
            netlifyIdentity.off('logout')
            netlifyIdentity.off('init')
        }
       
    }, [])

    const login = () => {
        netlifyIdentity.open()
    }

    const logout = () => {
        localStorage.removeItem("user")
        netlifyIdentity.logout()
    }

    const context = { user, login, logout, authReady }

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext