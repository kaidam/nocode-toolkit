import React from 'react'

const DocumentHTML = ({
  content,
}) => {
  return (
    <div 
      dangerouslySetInnerHTML={{__html: content }}
    >
    </div>
  )
}

export default DocumentHTML