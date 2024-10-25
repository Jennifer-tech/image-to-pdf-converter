import { useContext } from 'react'
import AuthContext from './stores/authContext'
import { FaFilePdf } from "react-icons/fa";
import { Link } from 'react-router-dom';


export default function NavBar() {
  const { user, login, logout } = useContext(AuthContext)

  return (
    <div className='w-full border border-black'>
      <header>
        <nav className='flex bg-blue-700 top-0 left-0 fixed text-white h-14 w-full justify-between items-center px-10'>
          {/* <div className='flex flex-row items-center space-x-1'> */}
          <Link
            className='flex flex-row items-center space-x-1'
            to='/'>
            <div className='h-auto'>
              <FaFilePdf className='w-9 h-auto bg-blue-700 lg:w-10' />
            </div>
            <div className='flex flex-col items-center justify-center h-10'>
              <h1 className='flex text-[9px] text-black font-primaryBold lg:text-[10px]'>Image </h1>
              <h1 className='flex text-[10px] text-white font-DancingScriptRegular lg:text-sm'>To Pdf</h1>
              <h1 className='flex text-[8px] text-black font-primaryBold lg:text-[10px]'>Converter</h1>
            </div>
          </Link>
          {/* </div> */}
          <div className='flex flex-row space-x-2'>
            {!user && <button onClick={login} className='border px-4 py-1 rounded-md text-sm font-primaryRegular'>Login/Signup</button>}
            {user && <p className='text-[8px] lg:text-sm items-center my-auto'>{user.email}</p>}
            {user && <button onClick={logout} className='border px-4 py-1 rounded-md text-sm font-primaryRegular'>Log out</button>}
          </div>

        </nav>
      </header>
    </div>
  )
}


