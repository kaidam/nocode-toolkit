import React from 'react'

const HTML = ({
  html,
}) => {
  return (
    <div 
      dangerouslySetInnerHTML={{__html: html }}
    >
    </div>
  )
}

export default HTML