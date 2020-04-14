import React from 'react'

const HTML = ({
  html,
}) => {
  return (
    <div 
      style={{
        width: '100%',
      }}
      dangerouslySetInnerHTML={{__html: html }}
    >
    </div>
  )
}

export default HTML