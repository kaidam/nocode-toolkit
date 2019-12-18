import React from 'react'

const DocumentHTML = ({
  content,
}) => {
  return (
    <div 
      dangerouslySetInnerHTML={{__html: content.html }}
    >
    </div>
  )
}

export default DocumentHTML