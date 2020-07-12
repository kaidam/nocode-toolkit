import React from 'react'
import HTML from '../components/widgets/HTML'

const Render = ({
  data,
}) => {
  return (
    <HTML
      html={ data.html }
    />
  )
}

const form = {
  id: 'html',
  title: 'HTML',
  initialValues: {
    html: '',
  },
  schema: [{
    id: 'html',
    noTitle: true,
    component: 'textarea',
    rows: 5,
  }],
}

export default {
  id: 'html',
  title: 'HTML',
  description: 'Insert raw HTML',
  Render,
  form,
}