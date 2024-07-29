import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Home from './components/Home'
import { AuthContextProvider } from './components/stores/authContext';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <AuthContextProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />}/>
        </Routes>
      </Router>
      {/* <Component {...pageProps} /> */}
    </AuthContextProvider>
  )
}

export default App
