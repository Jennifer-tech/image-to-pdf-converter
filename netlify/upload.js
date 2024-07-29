const axios = require('axios');
const { PDFDocument, rgb } = require('pdf-lib');
const { Buffer } = require('buffer')

exports.handler = async (event, context) => {
    if(event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        }
    }
}

const { file, filename, user } = JSON.parse(event.body);
console.log('file', file)
console.log('filename', filename)
console.log('user', user)
const buffer = Buffer.from(file, 'base64');
console.log('buffer', buffer)

try {
    const pdfDoc = await PDFDocument.create();
    console.log('pdfDoc', pdfDoc);
    const page = pdfDoc.addPage();
    cosole.log('page', page)
    const image = await pdfDoc.embedJpg(buffer);
    console.log('image', image)
    const { width, height } = image.scale(1);

    page.drawImage(image, {
        x: page.getWidth() / 2 - width / 2,
        y: page.getHeight() / 2 - height / 2,
        width,
        height,
    });

    const pdfBytes = await pdfDoc.save();
    console.log('pdfBytes', pdfBytes);
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64')
    console.log('pdfBase64', pdfBase64)

    if(user) {
        const response = await axios.post('https://api.netlify.com/api/v1/sites/YOUR_SITE_ID/files', pdfBase64, {
            headers: {
                Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`
            },
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully', data: response.data})
        };
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({ pdf: pdfBase64})
        }
    }
} catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'File upload failed', details: error.message })
    }
}