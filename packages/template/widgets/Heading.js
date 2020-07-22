import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import icons from '../icons'

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

  if(!title) return null
  
  return (
    <Typography 
      variant="h5" 
      className={ classes.heading }
    >
      { title }
    </Typography>
  )
}

const form = [{
  id: 'heading',
  title: 'Heading',
  schema: [{
    id: 'title',
    title: 'title',
    helperText: 'Enter the text for the title',
    default: '',
  }],
}]

export default {
  id: 'heading',
  title: 'Heading',
  description: 'Larger title text',
  Render,
  locations: ['document', 'section'],
  group: 'Content',
  form,
  icon: icons.title,
}