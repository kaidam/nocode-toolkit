import React from 'react'

import Layout from './Layout'
import useLayoutEditor from '../hooks/useLayoutEditor'

const LayoutEditor = ({
  content_id,
  layout_id,
  simpleMovement,
}) => {

  const {
    getAddMenu,
  } = useLayoutEditor({
    content_id,
    layout_id
  })

  return (
    <Layout
      content_id={ content_id }
      layout_id={ layout_id }
      getAddMenu={ getAddMenu }
      simpleMovement={ simpleMovement }
    />
  )
}

export default LayoutEditor