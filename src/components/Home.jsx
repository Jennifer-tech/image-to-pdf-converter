import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import AuthContext from './stores/authContext'
import netlifyIdentity from 'netlify-identity-widget'
import { db, collection, addDoc, Timestamp } from '../../netlify/functions/firebase';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


export default function Home() {
  const { user } = useContext(AuthContext)
  // console.log('userHome', user)
  const [files, setFiles] = useState(null);
  const [pdfURL, setPdfURL] = useState(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    netlifyIdentity.init();
  }, [])

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
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
    // if(!user) {
    //   setMessage('You need to be logged in to upload files')
    //   return;
    // }

    const base64Files = await Promise.all(
      Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          // console.log('reader', reader)
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject

        })
      })
    );


    try {
      const response = await axios.post('/.netlify/functions/upload', {
        files: base64Files,
        filenames: Array.from(files).map(file => file.name),
        userToken: user ? user.token.access_token : null,
      }, {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          // console.log('percentCompleted', percentCompleted)
          setProgress(percentCompleted)
        }
      });
      // console.log('response', response)

      if (response.data.pdfURL) {
        setPdfURL(response.data.pdfURL)
        // if (user) {
        //   await addDoc(collection(db, 'files'), {
        //     userId: user.id,
        //     filenames: Array.from(files).map(file => file.name),
        //     fileUrl: response.data.pdfURL,
        //     uploadedAt: Timestamp.fromDate(new Date())
        //   })
        //   toast.success('File uploaded and linked to user successfully')
        // }
        toast.success('File converted to pdf successfully')
        setFiles(null)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('File upload failed')
      // console.log(error)
    }
  };

  // const getHistory = async (e) => {
  //   e.preventDefault()
  //   try{
  //     const response = await axios.get('./netlify/functions/getPdfs');
  //     console.log('response', response)
  //     setFiles(response.data)
  //   } catch(error) {
  //     console.error('Error fetching files:', error.response ? error.response.data : error.message);
  //   }
  // }

  // ====

  return (
    <div className='flex w-full h-screen items-center justify-center'>
      <div className='flex flex-col max-w-3xl h-auto border justify-center items-center shadow-lg shadow-blue-500/50 rounded-lg p-5 lg:w-full'>
        <h1 className='text-xl font-primaryBold p-5'>Convert Image to Pdf</h1>
        <div className='flex justify-between m-5 items-center w-full'>
          <input type='file' ref={fileInputRef} onChange={handleFileChange} accept='image/jpeg, image/png, image/gif' multiple className='text-gray-900 text-base' />
          {/* <input type='file' ref={fileInputRef} multiple className='text-gray-900 text-base' /> */}
          <button onClick={handleUpload} className='border border-blue-700 rounded-3xl bg-blue-700 p-2 text-sm'>Convert to pdf</button>
          {/* <button onClick={convertToPdf} className='border border-blue-700 rounded-3xl bg-blue-700 p-2 text-sm'>Convert to pdf</button> */}
          {/* {message && <p>{message}</p>} */}
          {pdfURL && (
            <a href={`data:application/pdf;base64,${pdfURL}`} download='converted.pdf' className='border border-blue-700 rounded-3xl bg-blue-700 p-2 text-sm'>
              Download PDF
            </a>
          )}
          {user && <button className='border border-blue-700 rounded-3xl bg-blue-700 p-2 text-sm'><Link to='/pdfs'>View pdfs</Link></button>}
        </div>
        {/* <div className='flex right-0'>
          <button onClick={getHistory} className='border border-blue-700 rounded-3xl bg-blue-700 p-2 text-sm'><Link to='/pdfs'>View history</Link></button>

        </div> */}

        <div className='w-full h-2 border border-blue-300 m-5'>
          <div className='progress h-full bg-blue-700 transition-all duration-300 ease-in-out' style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  )
}




// import React, { useState } from 'react';
// import axios from 'axios';

// export default function Upload() {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage('Please select a file first.');
//       return;
//     }

//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = async () => {
//       const base64File = reader.result.split(',')[1];

//       try {
//         const response = await axios.post('/.netlify/functions/upload', {
//           file: base64File,
//           filename: file.name,
//         });

//         setMessage(response.data.message);
//       } catch (error) {
//         setMessage('File upload failed.');
//       }
//     };
//     reader.onerror = () => {
//       setMessage('Error reading file.');
//     };
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       <p>{message}</p>
//     </div>
//   );
// }






// ===========================================

// const convertToPdf = () => {
//   const files = fileInputRef.current.files;
//   console.log('files', files)
//   const images = []

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i]
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       images.push(event.target.result)
//       console.log('images', images)
//       if (images.length === files.length) {
//         pdfDownload(images)
//         fileInputRef.current.value = ''
//       }
//     };
//     reader.onerror = (error) => {
//       console.log('Error reading file', error)
//     }

//     reader.readAsDataURL(file)

//   }
// }

// const pdfDownload = (images) => {
//   let currentProgress = 0
//   const interval = setInterval(() => {
//     currentProgress += 10

//     if (currentProgress > 100) {
//       clearInterval(interval);
//       generatePdf(images)
//       setProgress(0)
//     } else {
//       setProgress(currentProgress)
//     }
//   }, 300)
// }

// const generatePdf = async (images) => {
//   try {
//     const doc = (
//       <Document>
//         {images.map((img, index) => (
//           <Page key={index} size='A4'>
//             <View style={{ display: 'flex', height: '100%', width: '100%', position: 'relative' }}>
//               <Image src={img} style={styles.image} />
//             </View>
//           </Page>
//         ))}
//       </Document>
//     );
//     const asPdf = pdf();

//     asPdf.updateContainer(doc)
//     const pdfBlob = await asPdf.toBlob();
//     saveAs(pdfBlob, 'convert.pdf');
//   } catch (error) {
//     console.log('error', error)
//   }

// }