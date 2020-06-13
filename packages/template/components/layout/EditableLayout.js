import React from 'react'

import Layout from './Layout'
import useLayoutEditor from '../hooks/useLayoutEditor'

const LayoutEditor = ({
  content_id,
  layout_id,
  simpleMovement,
  divider,
}) => {

  return (
    <Layout
      content_id={ content_id }
      layout_id={ layout_id }
      simpleMovement={ simpleMovement }
      divider={ divider }
    />
  )
}

export default LayoutEditor