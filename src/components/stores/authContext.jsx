// This keeps track of the authenticated user
// Context is being created as a way to provide global state to the entire application

import { createContext, useEffect, useState } from "react";
import netlifyIdentity from 'netlify-identity-widget'

const AuthContext = createContext({
    user: null,
    login: () => {  },
    logout: () => { },
    authReady: false //it keeps track when we've established a connection to netlify identity, until the connection is established, we changes to true
    // when a context is used, a provider is needed, which provides the context to the application the other components
})

export const AuthContextProvider = ({ children }) => {

    // This is used to keep track of the current user when they log in and log out
    let savedUser = JSON.parse(localStorage.getItem("user"))
    
    const [user, setUser] = useState(savedUser)
    const [authReady, setAuthReady] = useState(false)

    // it used to fire when the component first mounts
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
            // once netlifyIdentity has initialized, if there's a user logged in, we get that back through the setUser
            setUser(user)
            setAuthReady(true)
        })

         // init netlify identity connection
        // it initializes and makes connection to netlify which tells whether a user is logged in or not.
        netlifyIdentity.init()

        return () => {
            netlifyIdentity.off('login')
            netlifyIdentity.off('logout')
            netlifyIdentity.off('init')
        }
       
    }, [])

    const login = () => {
        // The open open up a model
        netlifyIdentity.open()
    }

    const logout = () => {
        localStorage.removeItem("user")
        netlifyIdentity.logout()
    }

    const context = { user, login, logout, authReady }

    // this is done so that it contains the value for the login and logout
    // AuthContext Provider wraps the entire application bcos it needs to wrap the components it provides the data to
    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext