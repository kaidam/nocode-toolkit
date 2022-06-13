import React from 'react'

import useHasFeature from '../hooks/useHasFeature'
import Widget from '../../widgets/Search'

const WidgetRender = Widget.Render

const Search = ({
  
}) => {
  const hasSearch = useHasFeature('search')
  
  return hasSearch ?
    <WidgetRender /> :
    null
}

export default Search