import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'
import Suspense from '../system/Suspense'

import cellTypes from './cellTypes'
import defaultRenderers from './renderers'

const CellOptions = lazy(() => import(/* webpackChunkName: "ui" */ './CellOptions'))

const Layout = ({
  data,
  renderers = {},
  renderCell,
  CellOptionsWrapper = CellOptions,
}) => {
  const showUI = useSelector(selectors.ui.showUI)

  const RootRenderer = renderers.root || defaultRenderers.root
  const RowRenderer = renderers.row || defaultRenderers.row
  const CellRenderer = renderers.cell || defaultRenderers.cell

  const rows = data.layout.map((row, i) => {

    const cells = row.map((cell, j) => {

      const cellConfig = cellTypes.getCellConfig(cell.component)
      const cellContent = cellTypes.getContent({
        cell,
        data,
      })

      const editor = data.disableLayoutEditor ? null : (
        <Suspense>
          <CellOptionsWrapper
            data={ data }
            cell={ cell }
            rowIndex={ i }
            cellIndex={ j }
          />
        </Suspense>
      )

      let content = renderCell && renderCell({
        data,
        cell,
      })

      if(!content) {
        const RenderComponent = cellConfig.component 
        content = (
          <RenderComponent
            showUI={ showUI }
            cell={ cell }
            content={ cellContent }
            rowIndex={ i }
            cellIndex={ j }
          />
        )
      }

      return (
        <CellRenderer
          key={ j }
          showUI={ showUI }
          cell={ cell }
          cellConfig={ cellConfig }
          editor={ editor }
          content={ content }
        />
      )

    })

    return (
      <RowRenderer
        key={ i }
        cells={ cells }
      />
    )             
  })

  return (
    <RootRenderer>
      { rows }
    </RootRenderer>
  )
}

export default Layout
