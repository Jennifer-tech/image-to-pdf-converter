import { db, getDocs, collection } from "./firebase";
export const handler = async (req, context) => {
  try {
    const userEmail = req.headers["user-email"];
    // console.log("userEmail", userEmail);

    if (!userEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User email not provided" }),
      };
    }

    // Referencing the specific user's PDF collection
    const userCollectionRef = collection(db, "userFiles", userEmail, 'pdfs');
    // console.log("userCollectionRef", userCollectionRef);

    // const pdfsCollectionRef = collection(userDocRef, 'pdfs')
    // console.log('pdfsCollectionRef', pdfsCollectionRef)

    const querySnapshot = await getDocs(userCollectionRef);
    // console.log("querySnapshot", querySnapshot);

    const files = querySnapshot.docs.map((doc) => doc.data());
    // console.log("files", files);

    return {
      statusCode: 200,
      body: JSON.stringify(files),
    };
  } catch (error) {
    // console.error("Error fetching files", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch files",
        details: error.message,
      }),
    };
  }
};
