const axios = require("axios");
const { PDFDocument } = require("pdf-lib");
const { Buffer } = require("buffer");
// const { useContext } = require("react");

export const handler = async (event, context) => {
//   const { user } = useContext(AuthContext);
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  // const { files, filenames, userToken } = JSON.parse(event.body);
  let files, filenames, userToken;
  try {
    const body = JSON.parse(event.body);
    files = body.files;
    filenames = body.filenames;
    userToken = body.userToken;
    console.log("Received files:", filenames);
  } catch (error) {
    console.error("Error parsing request body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid request body" }),
    };
  }

  // console.log("file", files);
  // console.log("filenames", filenames);
  // console.log("user", user);

  if (!files || files.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No files provided" }),
    };
  }

  try {
    const pdfDoc = await PDFDocument.create();
    console.log("pdfDoc", pdfDoc);

    for (let i = 0; i < files.length; i++) {
      const buffer = Buffer.from(files[i], "base64");
      console.log("buffer", buffer);
      const image = await pdfDoc.embedJpg(buffer);
      console.log("image", image);
      const { width, height } = image.scale(1);

      const page = pdfDoc.addPage();
      console.log("page", page);

      page.drawImage(image, {
        x: page.getWidth() / 2 - width / 2,
        y: page.getHeight() / 2 - height / 2,
        width,
        height,
      });
      console.log(`Added image ${filenames[i]} to pdf`)
    }

    const pdfBytes = await pdfDoc.save();
    console.log("pdfBytes", pdfBytes);
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
    console.log("pdfBase64", pdfBase64);

    if (userToken) {
      const response = await axios.post(
        `https://api.netlify.com/api/v1/sites/4464ebc9-36f8-4a2d-a75e-7e0ed2a465d9/files`,
        pdfBase64,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "content-Type": "application/pdf",
          },
        }
      );
      console.log("File uploaded successfuly")
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "File uploaded successfully",
          data: response.data,
        }),
      };
    } else {
      console.log("Returning PDF as base64 string")
      return {
        statusCode: 200,
        body: JSON.stringify({ pdf: pdfBase64 }),
      };
    }
  } catch (error) {
    console.error('Error processing files', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "File upload failed",
        details: error.message,
      }),
    };
  }
};
