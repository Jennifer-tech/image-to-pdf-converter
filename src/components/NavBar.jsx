import React, { useContext } from 'react'
// import pdfLogo from '../assets/images/pdfLogo.png'
import AuthContext from './stores/authContext'
import { FaFilePdf } from "react-icons/fa";
// import { Link } from 'react-router-dom'


export default function NavBar() {
  const { user, login, logout, authReady } = useContext(AuthContext)
  console.log('user', user)
  console.log('authReady', authReady)

  return (
    <div className='h-80vh w-full border border-green-500'>
      <header>
        <nav className='flex bg-blue-700 top-0 left-0 fixed text-white h-14 w-full justify-between items-center px-10'>
          <div className='flex flex-row items-center space-x-1'>
            <div className='h-auto'>
              <FaFilePdf className='w-9 h-auto bg-blue-700 lg:w-12' />
              {/* <img src={pdfLogo} alt='img-to-pdf-converter logo' className='w-[5] h-auto'/> */}
            </div>
            <div className='flex flex-col items-center justify-center h-10'>
              <h1 className='flex text-[9px] text-black font-primaryBold lg:text-sm lg:pt-2'>Image </h1>
              <h1 className='flex text-[10px] text-white font-DancingScriptRegular lg:text-sm'>To Pdf</h1>
              <h1 className='flex text-[8px] text-black font-primaryBold lg:text-sm lg:pb-2'>Converter</h1>
            </div>
          </div>

          {/* <ul>
            <li><Link to='/' className='text-white font-primaryRegular'>Home</Link></li> */}
            {/* <div>Hello</div> */}
            {/* {authReady && ( */}
              <div className='flex flex-row space-x-2'>
                {!user && <button onClick={login} className='border px-4 py-1 rounded-3xl text-sm font-primaryRegular'>Login/Signup</button>}
                {user && <p className='text-[8px] lg:text-sm items-center'>{user.email}</p>}
                {user && <button onClick={logout} className='border px-4 py-1 rounded-3xl text-sm font-primaryRegular'>Log out</button>}
              </div>
            {/* // )} */}
          {/* </ul> */}

        </nav>
      </header>
    </div>
  )
}


