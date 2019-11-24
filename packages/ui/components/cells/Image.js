import React from 'react'

const DocumentImage = ({
  content,
  showUI,
}) => {
  if(!content) return null
  const useStyle = showUI ? {
    maxWidth: 'calc(100% - 42px)',
  } : {
    width: '100%',
  }
  return (
    <img
      style={ useStyle }
      src={ content.image.url }
    />
  )
}

export default DocumentImage