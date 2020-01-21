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
  content,
}) => {

  const {
    modified,
    modifiedBy,
  } = content

  return (
    <div style={ styles.root }>
      Updated <span style={ styles.bold }>{ new Date(modified).toLocaleString() }</span> by <span style={ styles.bold }>{ modifiedBy }</span>
    </div>
  )
}

export default DocumentInfo