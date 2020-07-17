import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import contentSelectors from '../store/selectors/content'
import Typography from '@material-ui/core/Typography'

import icons from '../icons'

const useStyles = makeStyles(theme => ({
  heading: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}))

const Render = ({
  
}) => {
  const classes = useStyles()
  const {
    node,
  } = useSelector(contentSelectors.document)
  const title = (node.name || '').replace(/^(\w)/, st => st.toUpperCase())
  return (
    <Typography 
      variant="h5" 
      className={ classes.heading }
    >
      { title }
    </Typography>
  )
}

export default {
  id: 'documentTitle',
  title: 'Document Title',
  description: 'The title of the document',
  editable: false,
  locations: ['document'],
  group: 'Navigation',
  Render,
  icon: icons.documentTitle,
}