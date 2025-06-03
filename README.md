# Image to PDF Converter

A simple web-based tool that allows users to upload image files (JPEG, PNG), convert them into a PDF, and download the result. 

---

## Features

- Upload single or multiple images
- Automatically convert images to PDF
- Download the generated PDF
- [Optional] Store in cloud (e.g., Firebase) and generate download link if user is authenticated.

---

## Tech Stack

- **Frontend**: TailwindCSS, React
- **Backend**: Severless
- **PDF Library**: [`pdf-lib`](https://www.npmjs.com/package/pdf-lib)
- **Cloud Storage**: Firebase Storage (optional)
- **Authentication**: Netlify Auth (optional)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/image-to-pdf-converter.git
   cd image-to-pdf-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the project:
   ```bash
   npm start
   ```

> Make sure your Firebase config or API keys are set up properly in `.env` or config files if used.

---

## How to Use

1. Select or drag and drop images (JPEG or PNG)
2. Click “Convert to PDF”
3. Preview or download the generated PDF file
4. [Optional] Link is saved to cloud storage and download URL is provided if authenticated

---

## Project Structure (Optional)

```
├── public/
├── netlify/
    ├── functions/ 
├── src/
│   ├── components/
│   ├── assets/
│   └── App.jsx
│   └── main.jsx
├── .env
├── netlify.toml
└── README.md
```
---

## 🙌 Acknowledgements

- [`pdf-lib`](https://pdf-lib.js.org/)
- Firebase
- Netlify
