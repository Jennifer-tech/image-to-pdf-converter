import React, { useContext, useEffect, useState } from 'react'
import AuthContext from './stores/authContext'
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';


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
          toast.error('User not authenticated or email not available');
          return;
        }
        const response = await axios.get('/.netlify/functions/getPdfs', {
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
    if (user && user.email) {
      fetchPDFs()
    } else {
      console.log('Waiting for user data...')
    }
  }, [user]);

  const deletePdf = async (userEmail, fileId) => {
    try {
      console.log('deletePdf called with:', { userEmail, fileId });

      if (!userEmail || !fileId) {
        toast.error('User email or file ID not provided');
        return;
      }

      const response = await axios.post('/.netlify/functions/deletePdf', {
        userEmail,
        fileId,
        // userToken: user ? user.token.access_token : null,
      }, {
        headers: {
          'Content-Type': 'application/json',  // Specify the content type as JSON
        }
      });
      console.log('response', response)

      if (response.status === 200) {
        console.log('PDF deleted successfully')
        // Updating the list of pdfs
        setPdfs((prevPdfs) => prevPdfs.filter((pdf) => pdf.fileId !== fileId));
        toast.success('PDF deleted successfully');
      } else {
        console.error('Failed to delete PDF', response)

      }

    } catch (error) {
      console.error('Error deleting PDF:', error)
      toast.error('Failed to delete PDF');
    }
  }
  // The user is passed in the dependency array so that whenwver the user changes, if they
  // run th epage and log in, it's going to try to re-fetch the data because it's going to run
  // it again when it is a dependency, whenever this changes, this value is going to run this
  return (
    <div className='flex w-full h-screen items-center justify-center'>
      <div className='flex flex-col max-w-3xl w-full max-h-[80vh] overflow-y-scroll overflow-x-hidden no-scrollbar shadow-lg shadow-blue-500/50 rounded-lg p-5 lg:w-full'>
        <h1 className='text-xl font-primaryBold p-5 text-center sticky'>Your PDFs</h1>

        {pdfs && pdfs.map((pdf, index) => {
          console.log('pdf: ', pdf);
          return (
          < div key={index} className='flex justify-between m-5 items-center w-full' >
            <p className='text-sm font-primaryBold'>{pdf.fileName.join(', ')}</p>
            <p className='text-[9px] font-DancingScriptRegular lg:text-sm'>{new Date(pdf.uploadedAt.seconds * 1000).toLocaleString()}</p>
            <div className='flex flex-row items-center'>
              <a href={pdf.pdfURL} target='_blank' rel='noopener noreferrer' className='border border-blue-700 rounded-3xl bg-blue-700 p-2 text-sm mx-3'>Download</a>
              <MdDelete className='text-blue-700 size-7 cursor-pointer' onClick={() => {
                console.log('Deleting:', pdf.fileName, pdf.fileId);
                deletePdf(user.email, pdf.fileId)
              }} />
            </div>
          </div>
        )}
        )}
      </div>

    </div >
  );
}


