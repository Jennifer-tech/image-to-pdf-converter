import { PDFDocument } from "pdf-lib";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from "jwt-decode";
import 'dotenv/config'
import { storage, ref, uploadBytes, getDownloadURL, db, doc, setDoc, Timestamp } from './firebase';


export default async (req) => {
  
  let files, filenames, userToken;
  try {
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
      
      const page = pdfDoc.addPage();

      const targetWidth = page.getWidth() * 0.8;
      const targetHeight = page.getHeight() * 0.8;

      const scaleFactor = Math.min(targetWidth /image.width, targetHeight / image.height);
      const scaledWidth = image.width * scaleFactor;
      const scaledHeight = image.height * scaleFactor;

      page.drawImage(image, {
        x: (page.getWidth() - scaledWidth) /2,
        y: (page.getHeight() - scaledHeight) /2,
        width: scaledWidth,
        height: scaledHeight
      });
    }

    const pdfBytes = await pdfDoc.save();

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      const userEmail = decodedToken.email

      const pdfId = uuidv4()
      const pdfFileRef = ref(storage, `pdfs/${userEmail}/${pdfId}.pdf`)

      await uploadBytes(pdfFileRef, pdfBytes)

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
        }), {status: 200 })
      
    } else {
      return new Response(pdfBytes, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=${filenames[0] || 'download'}.pdf`
        },
        status:200
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({
      error: "File upload failed",
      details: error.message,
    }), { status: 500 });
  }
};




