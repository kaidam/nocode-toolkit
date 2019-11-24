import React from 'react'
import { useSelector } from 'react-redux'

import selectors from '../../store/selectors'
import EditWidget from './EditWidget'

const SingletonWidget = ({
  id,
  type,
  getValue,
  htmlMode,
  renderers,
}) => {
  const allContent = useSelector(selectors.content.contentAll)
  const item = allContent[id] || {}
  const itemData = item.data || {}
  const value = getValue ? getValue(itemData) : itemData

  return (
    <EditWidget
      id={ id }
      type={ type }
      location={`singleton:${id}`}
      value={ value }
      htmlMode={ htmlMode }
      renderers={ renderers }
    />
  )
}

export default SingletonWidget