import React from 'react'

const styles = {
  root: {
    color:'#999',
    paddingTop: '5px',
    paddingBottom: '5px',
    borderTop: '1px solid #e5e5e5',
    borderBottom: '1px solid #e5e5e5',
  },
  bold: {
    fontWeight: 500,
    color:'#666',
  }
}
const DocumentInfo = ({
  node,
}) => {
  const {
    modifiedTime,
    lastModifyingUser,
  } = node

  if(!modifiedTime || !lastModifyingUser) return null

  return (
    <div style={ styles.root }>
      Updated <span style={ styles.bold }>{ new Date(modifiedTime).toLocaleString() }</span> by <span style={ styles.bold }>{ lastModifyingUser }</span>
    </div>
  )
}

export default DocumentInfo