import React, { useRef, useState } from 'react'
import { Document, Page, Text, Image, pdf, StyleSheet, View } from '@react-pdf/renderer';
import { saveAs } from 'file-saver'

const styles = StyleSheet.create({
  image: {
    padding: 30,
    marginTop: 40,
    maxWidth: '100%',
    maxHeight: '100%'
  }
})

export default function Home() {
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const convertToPdf = () => {
    const files = fileInputRef.current.files;
    console.log('files', files)
    const images = []

    for (let i = 0; i < files.length; i++) {
      console.log('i', i, files[i])
      console.log('files.length', files.length)
      const file = files[i]
      console.log('file', file)
      const reader = new FileReader();
      console.log('reader', reader)

      reader.onload = (event) => {
        images.push(event.target.result)
        console.log('images', images)
        if (images.length === files.length) {
          pdfDownload(images)
          fileInputRef.current.value = ''
        }
      };
      reader.onerror = (error) => {
        console.log('Error reading file', error)
      }

      reader.readAsDataURL(file)

    }
  }

  const pdfDownload = (images) => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10

      if (currentProgress > 100) {
        clearInterval(interval);
        generatePdf(images)
        setProgress(0)
      } else {
        setProgress(currentProgress)
      }
    }, 300)
  }

  const generatePdf = async (images) => {
    try {
      const doc = (
        <Document>
          {images.map((img, index) => (
            <Page key={index} size='A4'>
              <View style={{ display: 'flex', height: '100%', width: '100%', position: 'relative' }}>
                <Image src={img} style={styles.image} />
              </View>
            </Page>
          ))}
        </Document>
      );
      const asPdf = pdf();

      asPdf.updateContainer(doc)
      const pdfBlob = await asPdf.toBlob();
      saveAs(pdfBlob, 'convert.pdf');
    } catch (error) {
      console.log('error', error)
    }

  }

  return (
    <div className='flex w-full h-80vh items-center justify-center content center'>
      <div className='flex flex-col max-w-80vw border border-red-500 justify-center items-center'>
        <h1 className='text-xl font-primaryBold p-5'>Convert Image to Pdf</h1>
        <div className='flex justify-between m-5'>
          <input type='file' ref={fileInputRef} multiple className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg' />
          <button onClick={convertToPdf} className='border border-blue-700 rounded-3xl bg-blue-700 p-2 text-sm'>Convert to pdf</button>
        </div>

        <div className='w-full h-2 border border-blue-700 m-5'>
          <div className='progress h-full bg-blue-700 transition-all duration-300 ease-in-out' style={{ width: `${progress}` }}></div>
        </div>
      </div>
    </div>
  )
}


