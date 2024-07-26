import React, { useContext } from 'react'
// import pdfLogo from '../assets/images/pdfLogo.png'
import AuthContext from './stores/authContext'
import { FaFilePdf } from "react-icons/fa";
import { Link } from 'react-router-dom'
// import Home from './Home';

export default function NavBar() {
  const { user, login, logout, authReady } = useContext(AuthContext)
  console.log('user', user)

  return (
    <div className='h-80vh w-full border border-green-500'>
      <header>
        <nav className='flex bg-blue-500 top-0 left-0 text-white h-14 w-full justify-between items-center px-10'>
          <div className='flex flex-row items-center space-x-1'>
            <div className='w-[5] h-auto border border-green-700'>
              <FaFilePdf className='w-[5] h-auto bg-blue-700' />
              {/* <img src={pdfLogo} alt='img-to-pdf-converter logo' className='w-[5] h-auto'/> */}
            </div>
            <h1 className='text-[4px] text-black'>Image To <br /> PDF Converter</h1>
          </div>

          {/* <ul> */}
          {/* <li><Link to='/' className='text-white'>Home</Link></li> */}
          {authReady && (
            <div className='space-x-2'>
              {!user && <button onClick={login} className='bg-green-500 px-4 py-1 rounded-3xl text-sm'>Login/Signup</button>}
              {user && <p className='text-sm'>{user.email}</p>}
              {user && <button onClick={logout} className='bg-red-500 px-4 py-1 rounded-3xl text-sm'>Log out</button>}
            </div>
          )}
          {/* </ul> */}

        </nav>
      </header>
    </div>
  )
}


