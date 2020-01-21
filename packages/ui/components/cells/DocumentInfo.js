import React from 'react'

const DocumentInfo = ({
  content,
}) => {

  const {
    modified,
    modifiedBy,
  } = content

  return (
    <p style={{color:'#999'}}>
      Updated <b style={{color:'#666'}}>{ new Date(modified).toLocaleString() }</b> by <b style={{color:'#666'}}>{ modifiedBy }</b>
    </p>
  )
}

export default DocumentInfo