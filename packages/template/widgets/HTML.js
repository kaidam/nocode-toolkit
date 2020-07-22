import React from 'react'
import HTML from '../components/widgets/HTML'
import icons from '../icons'

const Render = ({
  data,
}) => {
  return (
    <HTML
      html={ data.html }
    />
  )
}

const form = [{
  id: 'html',
  title: 'HTML',
  schema: [{
    id: 'html',
    noTitle: true,
    component: 'textarea',
    rows: 5,
    default: '',
  }],
}]

export default {
  id: 'html',
  title: 'HTML',
  description: 'Insert raw HTML',
  Render,
  locations: ['document', 'section'],
  group: 'Content',
  form,
  icon: icons.html,
}