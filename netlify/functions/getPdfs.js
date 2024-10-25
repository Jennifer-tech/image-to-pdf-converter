export const handler = async (req) => {
  try {
    const { db, getDocs, collection } = await import("./firebase");
    const userEmail = req.headers["user-email"];

    if (!userEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "User email not provided" }),
      };
    }

    // Referencing the specific user's PDF collection
    const userCollectionRef = collection(db, "userFiles", userEmail, 'pdfs');

    const querySnapshot = await getDocs(userCollectionRef);

    const files = querySnapshot.docs.map((doc) => doc.data());

    return {
      statusCode: 200,
      body: JSON.stringify(files),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch files",
        details: error.message,
      }),
    };
  }
};
