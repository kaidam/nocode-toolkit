import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import Link from '@nocode-toolkit/website/Link'
import selectors from '../../store/selectors'

import cellTypes from './cellTypes'
import defaultRenderers from './renderers'

const FolderLayout = ({
  data,
  renderers = {},
}) => {

  const folder = data.item

  const childrenListSelector = useMemo(selectors.content.childrenList, [])
  const childrenList = useSelector(state => childrenListSelector(state, folder.id))
  const routeMap = useSelector(selectors.nocode.routeMap)

  const titleConfig = cellTypes.getCellConfig('title')
  const TitleComponent = titleConfig.component 
  
  const pageLinks = childrenList
    .filter(child => {
      const route = routeMap[child.id]
      return route ? true : false
    })
    .map((child, i) => {
      const route = routeMap[child.id]
      return (
        <div key={ i }>
          <Link
            path={ route.path }
            name={ route.name }
          >
            { child.data.name }
          </Link>
        </div>
      )
    })

  const content = [
    <TitleComponent
      content={{
        title: folder.data.name,
      }}
    />
  ].concat(pageLinks)

  const showUI = useSelector(selectors.ui.showUI)

  const RootRenderer = renderers.root || defaultRenderers.root
  const RowRenderer = renderers.row || defaultRenderers.row
  const CellRenderer = renderers.cell || defaultRenderers.cell

  const rows = content.map((row, i) => {
    const cell = (
      <CellRenderer
        showUI={ showUI }
        cell={{
          settings: {
            align: 'left',
          }
        }}
        content={ row }
      />
    )
    return (
      <RowRenderer
        key={ i }
        cells={ [cell] }
      />
    )             
  })

  return (
    <RootRenderer>
      { rows }
    </RootRenderer>
  )
}

export default FolderLayout
