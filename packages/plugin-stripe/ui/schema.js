import React from 'react'

const FieldRender = () => {
  return (
    <div>Hello component</div>
  )
}

const schema = {
  title: 'Stripe',
  initialValues: {
    test: '',
  },
  schema: [{
    id: 'color',
    title: 'Color',
    helperText: 'Choose your color',
    component: 'color',
  }, {
    id: 'title',
    title: 'Title',
    helperText: 'Enter the title for your website',
  }, {
    id: 'copyright_message',
    title: 'Copyright Message',
    helperText: 'Enter the copyright message to appear in the footer',
  }, {
    id: 'description',
    title: 'Description',
    component: 'textarea',
    rows: 3,
    helperText: 'Enter the description for your website',
  }, {
    id: 'keywords',
    title: 'Keywords',
    component: 'textarea',
    rows: 3,
    helperText: 'Enter some keywords for search engines to find your website',
  }]
}

const schemas = {
  folder,
  externalLink,
  title,
  richtext,
  image,
  youtube,
  settings,
  logo,
  section,
}

export default schema