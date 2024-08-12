import { db, doc, deleteDoc, getStorage, ref, deleteObject } from "./firebase";

export const handler = async (req, context) => {
  try {
    const { userEmail, fileId } = JSON.parse(req.body);
    // console.log('userEmail', userEmail)
    // console.log('fileId', fileId)

    if (!userEmail || !fileId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User email or file ID not provided" }),
      };
    }

    // Deleting document from firestore
  

    // Delete the file from firebase storage
    const storage = getStorage();
    // console.log("storage", storage)
    const filePath = `pdfs/${userEmail}/${fileId}.pdf`
    const storageRef = ref(storage, filePath);
    // console.log('storageRef', storageRef)
    await deleteObject(storageRef);

    const docRef = doc(db, "userFiles", userEmail, "pdfs", fileId);
    // console.log('docRef', docRef)
    await deleteDoc(docRef);
    // console.log(`Deleted document from Firestore: ${fileId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "PDF deleted successfully from both storage and Firestore" }),
    };
  } catch (error) {
    // console.error("Error deleting files", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to delete files",
        details: error.message,
      }),
    };
  }
};
