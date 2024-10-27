import { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import AuthContext from './stores/authContext'
import netlifyIdentity from 'netlify-identity-widget'
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


export default function Home() {
  const { user } = useContext(AuthContext)
  const [files, setFiles] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    netlifyIdentity.init();
  }, [])

  useEffect(() => {
    return () => {
      if(blobUrl) URL.revokeObjectURL(blobUrl)
    };
  }, [blobUrl])

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const validImageTypes = ['image/jpeg', 'image/png'];
    const isValid = Array.from(selectedFiles).every(file => validImageTypes.includes(file.type))

    if (!isValid) {
      toast.info('please select only image files (JPEG, PNG, GIF)');
      setFiles(null);

      return
    }

    setFiles(selectedFiles);
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!files || files.length === 0) {
      toast.info('Please select a file first');
      return;
    }

    const base64Files = await Promise.all(
      Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject

        })
      })
    );


    try {
      const responseType = user ? 'json' : 'blob'
      const response = await axios.post('/.netlify/functions/upload', {
        files: base64Files,
        filenames: Array.from(files).map(file => file.name),
        userToken: user ? user.token.access_token : null,
      }, {
        headers: { 'Content-Type': 'application/json' },
        responseType,
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percentCompleted)
        }
      });

      if(user && response.data.pdfURL) {
        setPdfURL(response.data.pdfURL)
        toast.success('File converted to pdf successfully')
        setFiles(null)
      } else {
        const blob = response.data;
        
        const url = URL.createObjectURL(blob)
        setBlobUrl(url);
        
        toast.success('File converted to pdf successfully');
      } 
    } catch (error) {
      toast.error('File upload failed')
    }
  };


  return (
    <div className='flex w-full h-screen items-center justify-center'>
      <div className='flex flex-col max-w-3xl h-auto border justify-center items-center shadow-lg shadow-blue-500/50 rounded-lg p-5 lg:w-full'>
        <h1 className='text-xl font-primaryBold p-5'>Convert Image to Pdf</h1>
        <div className='flex justify-between m-5 items-center w-full'>
          <input type='file' ref={fileInputRef} onChange={handleFileChange} accept='image/jpeg, image/png' multiple className='text-gray-900 text-base' />
          <button onClick={handleUpload} className='border border-blue-700 rounded-md bg-blue-700 p-2 text-sm text-white'>Convert to pdf</button>
          {pdfURL && (
            <a href={pdfURL} download='converted.pdf' className='border border-blue-700 rounded-md bg-blue-700 p-2 text-sm text-white'>
              Download PDF
            </a>
          )}
          {blobUrl && (
            <a href={blobUrl} download='converted.pdf' className='border border-blue-700 rounded-md bg-blue-700 p-2 text-sm text-white'>
              Download PDF
            </a>
          )}
          {user && <button className='border border-blue-700 rounded-md bg-blue-700 p-2 text-sm text-white'><Link to='/pdfs'>View pdfs</Link></button>}
        </div>

        <div className='w-full h-2 border border-blue-300 m-5'>
          <div className='progress h-full bg-blue-700 transition-all duration-300 ease-in-out' style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  )
}