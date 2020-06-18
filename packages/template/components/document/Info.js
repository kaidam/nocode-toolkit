import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
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
}))

const DocumentInfo = ({
  node,
}) => {

  const classes = useStyles()
  const {
    modifiedTime,
    lastModifyingUser,
  } = node

  if(!modifiedTime && !lastModifyingUser) return null

  return (
    <div className={ classes.root }>
      Updated <span className={ classes.bold }>{ new Date(modifiedTime).toLocaleString() }</span>
      {
        lastModifyingUser && (
          <>
            &nbsp;by <span className={ classes.bold }>{ lastModifyingUser }</span>
          </>
        )
      }
    </div>
  )
}

export default DocumentInfo