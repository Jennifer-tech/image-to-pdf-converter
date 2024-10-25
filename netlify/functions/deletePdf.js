import { collectionGroup, query, Timestamp, where } from "firebase/firestore";
import { db, doc, deleteDoc, getStorage, ref, deleteObject, getDocs } from "./firebase";
// import { schedule } from '@netlify/functions'

export const handler = async (req) => {
  if(req.httpMethod === 'POST') {
    try {
      const { userEmail, fileId } = JSON.parse(req.body);
  
      if (!userEmail || !fileId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "User email or file ID not provided" }),
        };
      }
  
     
      const storage = getStorage();
      const filePath = `pdfs/${userEmail}/${fileId}.pdf`
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
  
      const docRef = doc(db, "userFiles", userEmail, "pdfs", fileId);
      await deleteDoc(docRef);
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "PDF deleted successfully from both storage and Firestore" }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to delete files",
          details: error.message,
        }),
      };
    }
  }
};

export const scheduledDeletion = async () => {
  try {
    const pdfsToDelete = await getOldPdfs();

    for (const pdf of pdfsToDelete) {
      console.log('pdf', pdf)
      const { userEmail, fileId } = pdf;
      console.log('userEmail', userEmail)
      console.log('fileId', fileId)

      const storage = getStorage();
      const filePath = `pdfs/${userEmail}/${fileId}.pdf`;
      const storageRef = ref(storage, filePath);

      await deleteObject(storageRef);

      const docRef = doc(db, "userFiles", userEmail, "pdfs", fileId);
      await deleteDoc(docRef);

    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Old PDFs deleted successfully" }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Scheduled deletion failed",
        details: error.message,
      }),
    }
  }
};

async function getOldPdfs() {
  const aWeekAgo = new Date();
  aWeekAgo.setData(aWeekAgo.getDate() - 7);

  const pdfQuerySnapshot = await getDocs(
    query(
      collectionGroup(db, 'pdfs'),
      where('uploadedAt', '<', Timestamp.fromDate(aWeekAgo))
    )
  )

  return pdfQuerySnapshot.docs.map((doc) => {
    console.log('doc2', doc);

    return {
      userEmail: doc.id.split('/')[1],
      fileId: doc.id.split('/')[3],
    }

  })
}