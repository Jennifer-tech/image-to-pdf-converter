import React, { useContext, useEffect, useState } from 'react'
import AuthContext from './stores/authContext'
import { MdDelete } from "react-icons/md";
import axios from 'axios';


export default function PdfListing() {
  const { user } = useContext(AuthContext)
  console.log('userPDF', user)
  const [pdfs, setPdfs] = useState(null)
  // const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPDFs = async () => {
      // e.preventDefault()
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        console.log('userStorage', user)

        if (!user || !user.email) {
          console.error('User not authenticated or email not available');
          return;
        }
        const response = await axios.get('/.netlify/functions/getPdfs', {
          // userToken: user ? user.token.access_token: null
          headers: {
            'User-Email': user.email
          }
        });
        console.log('response', response)
        setPdfs(response.data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    }
    fetchPDFs()
  }, [user])
  // The user is passed in the dependency array so that whenwver the user changes, if they
  // run th epage and log in, it's going to try to re-fetch the data because it's going to run
  // it again when it is a dependency, whenever this changes, this value is going to run this
  return (
    <div className='flex w-full h-screen items-center justify-center'>
      <div className='flex flex-col max-w-3xl w-full max-h-[80vh] overflow-y-scroll overflow-x-hidden no-scrollbar shadow-lg shadow-blue-500/50 rounded-lg p-5 lg:w-full'>
        <h1 className='text-xl font-primaryBold p-5 text-center sticky'>Your PDFs</h1>

        {pdfs && pdfs.map((pdf, index) => (
          < div key={index} className='flex justify-between m-5 items-center w-full' >
            <p className='text-sm font-primaryBold'>{pdf.fileName.join(', ')}</p>
            <p className='text-[9px] font-DancingScriptRegular lg:text-sm'>{new Date(pdf.uploadedAt.seconds * 1000).toLocaleString()}</p>
            <div className='flex flex-row items-center'>
              <a href={pdf.pdfURL} target='_blank' rel='noopener noreferrer' className='border border-blue-700 rounded-3xl bg-blue-700 p-2 text-sm mx-3'>Download</a>
              <MdDelete className='text-blue-700 size-7' />
            </div>
          </div>
        )
        )}
      </div>

    </div >
  );
}


