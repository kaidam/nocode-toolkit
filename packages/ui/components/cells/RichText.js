import React from 'react'

const RichText = ({
  content,
}) => {
  return (
    <div 
      dangerouslySetInnerHTML={{__html: content ? content.text : '' }}
    >
    </div>
  )
}

export default RichText