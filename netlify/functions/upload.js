import { PDFDocument } from "pdf-lib";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from "jwt-decode";
import 'dotenv/config'
import { storage, ref, uploadBytes, getDownloadURL, db, doc, setDoc, Timestamp } from './firebase';


export default async (req) => {
  
  let files, filenames, userToken;
  try {
    // const { files, filenames, userToken } = JSON.parse(req.body);
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);
    files = body.files;
    filenames = body.filenames;
    userToken = body.userToken;
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response(JSON.stringify({ message: "Invalid request body" }), { status: 400 });
  }

  if (!files || files.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No files provided" }),
    };
  }

  try {
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < files.length; i++) {
      const buffer = Buffer.from(files[i], "base64");
      let image = null
      try{
        image = await pdfDoc.embedJpg(buffer)
      } catch (error) {
        try{
          image = await pdfDoc.embedPng(buffer)
        } catch (error) {
          throw new Error("Format not supported")
        }
      }
      // const { width, height } = image.scale(0.5);

      const page = pdfDoc.addPage();

      page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight()
      });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      const userEmail = decodedToken.email

      const pdfId = uuidv4()
      const pdfFileRef = ref(storage, `pdfs/${userEmail}/${pdfId}.pdf`)

      await uploadBytes(pdfFileRef, Buffer.from(pdfBase64, 'base64'))

      const pdfURL = await getDownloadURL(pdfFileRef)

      const userDocRef = doc(db, 'userFiles', userEmail, 'pdfs', pdfId);

      await setDoc(userDocRef, {
        fileId: pdfId,
        fileName: filenames,
        pdfURL,
        uploadedAt: Timestamp.fromDate(new Date())
      })

      return new Response(JSON.stringify({
        message: "File uploaded successfully",
        pdfURL
        // statusCode: 200,
        // body: JSON.stringify({
        //   message: "File ed successfully",
        //   pdfURL
        }), {status: 200 })
      
    } else {
      return new Response(JSON.stringify({ pdfURL: pdfBase64}), { status: 200 })
      //   statusCode: 200,
      //   body: JSON.stringify({ pdfURL: pdfBase64 }),
      // };
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: "File upload failed",
      details: error.message,
    }), { status: 500 });
  }
};




