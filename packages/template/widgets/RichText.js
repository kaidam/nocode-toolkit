import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import icons from '../icons'

const useStyles = makeStyles(theme => {
  return {
    root: {
      color: 'rgb(117, 117, 117)',
    },
  }
})

const Render = ({
  data,
}) => {

  const classes = useStyles()
  data = data || {}
  return (
    <Typography
      className={ classes.root }
      variant={ data.style || 'body1' }
    >
      { data.text || 'text...' }
    </Typography>
  )
}

const form = [{
  id: 'richtext',
  title: 'Text',
  schema: [{
    id: 'text',
    rows: 5,
    component: 'textarea',
    default: '',
  }, {
    id: 'style',
    component: 'select',
    default: 'body1',
    options: [{
      title: 'Larger Body Text',
      value: 'body1',
    },{
      title: 'Smaller Body Text',
      value: 'body2',
    },{
      title: 'Caption',
      value: 'caption',
    },{
      title: 'Heading 1',
      value: 'h1',
    },{
      title: 'Heading 2',
      value: 'h2',
    },{
      title: 'Heading 3',
      value: 'h3',
    },{
      title: 'Heading 4',
      value: 'h4',
    },{
      title: 'Heading 5',
      value: 'h5',
    },{
      title: 'Heading 6',
      value: 'h6',
    }]
  }],
}]

export default {
  id: 'richtext',
  title: 'Rich Text',
  description: 'A small chunk of formatted text',
  Render,
  locations: ['document'],
  group: 'Content',
  form,
  icon: icons.text,
}