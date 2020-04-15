import React from 'react'
import Typography from '@material-ui/core/Typography'

const Render = ({
  data,
}) => {
  data = data || {}
  return (
    <Typography variant={ data.style }>
      { data.text || 'TEXT HERE' }
    </Typography>
  )
}

const form = {
  id: 'richtext',
  title: 'Text',
  initialValues: {
    text: '',
    style: 'body1',
  },
  schema: [{
    id: 'style',
    component: 'select',
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
  }, {
    id: 'text',
    rows: 5,
    component: 'textarea',
  }],
}

const widget = () => ({
  id: 'richtext',
  Render,
  form,
})

export default widget