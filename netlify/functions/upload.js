const axios = require("axios");
const { PDFDocument } = require("pdf-lib");
const { Buffer } = require("buffer");
const { v4: uuidv4 } = require('uuid');
const { jwtDecode } = require('jwt-decode');
import { storage, ref, uploadBytes, getDownloadURL, db, collection, addDoc, Timestamp, doc, setDoc } from './firebase';
// import { storage, ref, uploadBytes, getDownloadURL, db } from './firebase/storage';
// import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
// import { ref } from 'firebase/storage'
require('dotenv').config();

export const handler = async (req, context) => {
  
// console.log('no cry')
  let files, filenames, userToken;
  try {
    // const { files, filenames, userToken } = JSON.parse(req.body);
    const body = JSON.parse(req.body);
    files = body.files;
    filenames = body.filenames;
    // console.log("Received files:", files, filenames, userToken);
    userToken = body.userToken;
  } catch (error) {
    // console.error("Error parsing request body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }

  if (!files || files.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No files provided" }),
    };
  }

  try {
    const pdfDoc = await PDFDocument.create();
    // console.log("pdfDoc", pdfDoc);

    for (let i = 0; i < files.length; i++) {
      const buffer = Buffer.from(files[i], "base64");
      // console.log("buffer", buffer);
      const image = await pdfDoc.embedJpg(buffer);
      // console.log("image", image);
      const { width, height } = image.scale(1);

      const page = pdfDoc.addPage();
      // console.log("page", page);

      page.drawImage(image, {
        x: page.getWidth() / 2 - width / 2,
        y: page.getHeight() / 2 - height / 2,
        width,
        height,
      });
      // console.log(`Added image ${filenames[i]} to pdf`)
    }

    const pdfBytes = await pdfDoc.save();
    // console.log("pdfBytes", pdfBytes);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
    // console.log("pdfBase64", pdfBase64);

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      const userEmail = decodedToken.email
      // console.log('userEmail', userEmail)

      const pdfId = uuidv4()
      // console.log('id', id)
      const pdfFileRef = ref(storage, `pdfs/${userEmail}/${pdfId}.pdf`)
      // console.log('pdfFileRef', pdfFileRef)

      await uploadBytes(pdfFileRef, Buffer.from(pdfBase64, 'base64'))

      const pdfURL = await getDownloadURL(pdfFileRef)
      // console.log('pdfURL', pdfURL)

      // const userFiles = getDeployStore('userFiles')
      // console.log('userFiles', userFiles)

      // const id = crypto.randomUUID();

      // await userFiles.set(id, pdfBase64)

      const userDocRef = doc(db, 'userFiles', userEmail, 'pdfs', pdfId);

      await setDoc(userDocRef, {
        fileId: pdfId,
        fileName: filenames,
        pdfURL,
        uploadedAt: Timestamp.fromDate(new Date())
      })

      // await addDoc(collection(db, 'userFiles'), {
      //   id,
      //   userEmail,
      //   filenames,
      //   pdfURL,
      //   uploadedAt: Timestamp.fromDate(new Date())
      // })

      // const response = await axios.post(
      //   `https://api.netlify.com/api/v1/sites/process.env.NETLIFY_SITE_ID/files`,
      //   pdfBase64,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${userToken}`,
      //       "content-Type": "application/pdf",
      //     },
      //   }
      // );
      // console.log("File uploaded successfuly to firestore")
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "File uploaded successfully",
          // data: response.data,
          pdfURL
        }),
      };
    } else {
      // console.log("Returning PDF as base64 string")
      return {
        statusCode: 200,
        body: JSON.stringify({ pdfURL: pdfBase64 }),
      };
    }
  } catch (error) {
    // console.error('Error processing files', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "File upload failed",
        details: error.message,
      }),
    };
  }
};



// const axios = require('axios');
// const FormData = require('form-data');

// export const handler = async (event, context) => {
//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       body: 'Method Not Allowed',
//     };
//   }

//   const { file, filename } = JSON.parse(event.body);
//   const buffer = Buffer.from(file, 'base64');

//   const formData = new FormData();
//   formData.append('file', buffer, filename);

//   try {
//     const response = await axios.post('https://api.netlify.com/api/v1/sites/YOUR_SITE_ID/files', formData, {
//       headers: {
//         ...formData.getHeaders(),
//         Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
//       },
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'File uploaded successfully', data: response.data }),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'File upload failed', details: error.message }),
//     };
//   }
// };



