import { useContext, useEffect, useState } from 'react'
import AuthContext from './stores/authContext'
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';


export default function PdfListing() {
  const { user } = useContext(AuthContext)
  const [pdfs, setPdfs] = useState(null)

  function firebaseTimestampToMillis(timestamp) {
    return timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  }
  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))

        if (!user || !user.email) {
          toast.error('User not authenticated or email not available');
          return;
        }
        const response = await axios.get('/.netlify/functions/getPdfs', {
          headers: {
            'User-Email': user.email
          }
        });
        const sortedPdfs = response.data.sort((b, a) => {
          const dateA = firebaseTimestampToMillis(a.uploadedAt);
          const dateB = firebaseTimestampToMillis(b.uploadedAt);
          return dateA - dateB;
        })
        setPdfs(sortedPdfs);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    }
    if (user && user.email) {
      fetchPDFs()
    } else {
      toast.info('Waiting for user data...')
    }
  }, [user]);

  const deletePdf = async (userEmail, fileId) => {
    try {

      if (!userEmail || !fileId) {
        toast.error('User email or file ID not provided');
        return;
      }

      const response = await axios.post('/.netlify/functions/deletePdf', {
        userEmail,
        fileId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        setPdfs((prevPdfs) => prevPdfs.filter((pdf) => pdf.fileId !== fileId));
        toast.success('PDF deleted successfully');
      } else {
        toast.error('Failed to delete PDF')

      }

    } catch (error) {
      toast.error('Failed to delete PDF');
    }
  }
  return (
    <div className='flex flex-col w-full items-center justify-center pt-14 overflow h-[100px-14px]'>
      <div className='w-full bg-white sticky top-[56px] z-10'>
        <h1 className='text-xl font-primaryBold p-5 text-center'>Your PDFs</h1>
      </div>

      {pdfs && pdfs.map((pdf, index) => {
        return (
          < div key={index} className='flex flex-row justify-between m-2 items-center w-full' >
            <div className='flex flex-row justify-between w-full mx-10'>
              <p className='text-sm font-primaryBold'>{pdf.fileName.join(', ')}</p>
              <p className='text-[9px] font-DancingScriptRegular lg:text-sm'>{new Date(pdf.uploadedAt.seconds * 1000).toLocaleString()}</p>
            </div>
           
            <div className='w-2/6 flex flex-row items-center justify-between mx-10'>
              <a href={pdf.pdfURL} rel='noopener noreferrer' className='border border-blue-700 rounded-md bg-blue-700 p-2 text-sm mx-3 text-white'>Download</a>
              <MdDelete className='flex text-blue-700 size-7 cursor-pointer' onClick={() => {
                deletePdf(user.email, pdf.fileId)
              }} />
            </div>
          </div>
        )
      }
      )}

    </div >
  );
}


