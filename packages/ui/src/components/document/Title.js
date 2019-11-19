import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => createStyles({
  heading: {
    fontWeight: 'bold',
    color: theme.palette.primary.dark,
  },
}))

const DocumentTitle = ({
  content,
}) => {
  const classes = useStyles()
  const title = content ?
    content.title :
    ''

  return (
    <Typography 
      variant="h5" 
      className={ classes.heading }
    >
      { title }
    </Typography>
  )
}

export default DocumentTitle