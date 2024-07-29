import React, { useContext, useEffect, useState } from 'react'
import AuthContext from './stores/authContext'

export default function pdfConversion() {
  const { user, authReady } = useContext(AuthContext)
  const [pdfs, setPdfs] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if(authReady) {
      fetch('/.netlify/functions/pdf', user && {
          headers: {
            Authorization: 'Bearer ' + user.token.access_token
          }
        })
      .then(res => {
        if(!res.ok) {
          throw Error('You must be logged in to view this content')
        }
        return res.json()
      })
      .then(data => {
        setPdfs(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.message)
        setPdfs(null)
      })
    }
  }, [user, authReady])
  // The user is passed in the dependency array so that whenwver the user changes, if they
  // run th epage and log in, it's going to try to re-fetch the data because it's going to run
  // it again when it is a dependency, whenever this changes, this value is going to run this
  return (
    <div>

      {!authReady && <div>Loading ... </div>}

      {error && (
        <div className=''>
          <p>{ error }</p>
        </div>
      )}

      {pdfs && pdfs.map(pdf => (
        <div key={pdf.title} className=''>
          <h3>{ pdf.title}</h3>
          <h4>Welcome {pdf.author}</h4>
        </div>
      ))}
    </div>
  )
}


