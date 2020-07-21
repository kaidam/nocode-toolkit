import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import contentSelectors from '../store/selectors/content'

import icons from '../icons'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
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

const Render = ({
  
}) => {

  const classes = useStyles()

  const {
    node,
  } = useSelector(contentSelectors.document)

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

export default {
  id: 'documentInfo',
  title: 'Document Info',
  description: 'The author and date of the document',
  editable: false,
  locations: ['document'],
  group: 'Navigation',
  Render,
  icon: icons.documentInfo,
}
