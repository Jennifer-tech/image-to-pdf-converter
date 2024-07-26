// import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import { AuthContextProvider } from './components/stores/authContext';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <AuthContextProvider>
      <NavBar />
      {/* <Component {...pageProps} /> */}
    </AuthContextProvider>
  )
}

export default App
