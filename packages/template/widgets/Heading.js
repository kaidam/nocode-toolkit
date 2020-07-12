import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  heading: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}))

const Render = ({
  data,
}) => {

  const classes = useStyles()
  const title = data ?
    data.title :
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

const form = {
  id: 'heading',
  title: 'Heading',
  initialValues: {
    title: '',
  },
  schema: [{
    id: 'title',
    title: 'title',
    helperText: 'Enter the text for the title',
  }],
}

export default {
  id: 'heading',
  title: 'Heading',
  description: 'Larger title text',
  Render,
  form,
}