import React from 'react'

const DocumentTitle = ({
  content,
}) => {
  const title = content ?
    content.title :
    ''
  return (
    <h3>{ title }</h3>
  )
}

export default DocumentTitle