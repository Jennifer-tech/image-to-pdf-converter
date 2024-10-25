import { useContext, useEffect, useState } from 'react'
import AuthContext from './stores/authContext'
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';


export default function PdfListing() {
  const { user } = useContext(AuthContext)
  const [pdfs, setPdfs] = useState(null)

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
        setPdfs(response.data);
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
  // The user is passed in the dependency array so that whenwver the user changes, if they
  // run th epage and log in, it's going to try to re-fetch the data because it's going to run
  // it again when it is a dependency, whenever this changes, this value is going to run this
  return (
    <div className='flex flex-col w-full items-center justify-center pt-14 overflow h-[100px-14px]'>
      {/* <div className='flex flex-col max-w-3xl w-full max-h-[80vh] overflow-y-scroll overflow-x-hidden no-scrollbar shadow-lg shadow-blue-500/50 rounded-lg p-5 lg:w-full'> */}
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
            {/* <div className='flex w-full justify-end px-4'> */}
              
            {/* </div> */}
            <div className='w-2/6 flex flex-row items-center justify-between mx-10'>
              <a href={pdf.pdfURL} target='_blank' rel='noopener noreferrer' className='border border-blue-700 rounded-md bg-blue-700 p-2 text-sm mx-3 text-white'>Download</a>
              <MdDelete className='flex text-blue-700 size-7 cursor-pointer' onClick={() => {
                deletePdf(user.email, pdf.fileId)
              }} />
            </div>
          </div>
        )
      }
      )}
      {/* </div> */}

    </div >
  );
}


