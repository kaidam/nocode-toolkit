import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'
import Suspense from '../system/Suspense'

import cellTypes from './cellTypes'
import defaultRenderers from './renderers'

const CellOptions = lazy(() => import(/* webpackChunkName: "ui" */ './CellOptions'))
const CellContainer = lazy(() => import(/* webpackChunkName: "ui" */ './CellContainer'))

const Layout = ({
  data,
  renderers = {},
  renderCell,
  CellOptionsWrapper = CellOptions,
  location,
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
            location={ location }
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

      const renderedCell = (
        <CellRenderer
          key={ j }
          showUI={ showUI }
          cell={ cell }
          cellConfig={ cellConfig }
          editor={ editor }
          content={ content }
        />
      )

      if(showUI) {
        return (
          <Suspense>
            <CellContainer>
              { renderedCell }
            </CellContainer>
          </Suspense>
        )
      }
      else {
        return renderedCell
      }

    })

    return (
      <RowRenderer
        key={ i }
        cells={ cells }
        rowIndex={ i }
        rowCount={ data.layout.length }
        showUI={ showUI }
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
