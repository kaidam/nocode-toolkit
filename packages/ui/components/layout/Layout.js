import React, { lazy, useState } from 'react'
import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'
import Suspense from '../system/Suspense'

import cellTypes from './cellTypes'
import defaultRenderers from './renderers'

const CellContainer = lazy(() => import(/* webpackChunkName: "ui" */ './CellContainer'))

const Layout = ({
  data,
  renderers = {},
  renderCell,
  CellOptionsWrapper,
  location,
  selectable = true,
}) => {
  const showUI = useSelector(selectors.ui.showUI)

  const [activeCell, setActiveCell] = useState(null)

  const RootRenderer = renderers.root || defaultRenderers.root
  const RowRenderer = renderers.row || defaultRenderers.row
  const CellRenderer = renderers.cell || defaultRenderers.cell

  const rows = data.layout.map((row, i) => {

    const cells = row.map((cell, j) => {

      const isActive = selectable && activeCell && activeCell.row == i && activeCell.cell == j

      const cellConfig = cellTypes.getCellConfig(cell.component)
      const cellContent = cellTypes.getContent({
        cell,
        data,
      })

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
            data={ data }
          />
        )
      }

      const renderedCell = (
        <CellRenderer
          key={ j }
          showUI={ showUI }
          cell={ cell }
          cellConfig={ cellConfig }
          content={ content }
        />
      )

      if(showUI) {
        return (
          <Suspense>
            <CellContainer
              CellOptionsWrapper={ CellOptionsWrapper }
              isActive={ isActive }
              location={ location }
              data={ data }
              cell={ cell }
              rowIndex={ i }
              cellIndex={ j }
              selectable={ selectable }
              onSelect={ () => setActiveCell(isActive ? null : {row:i, cell:j})}
              onResetSelect={ () => {
                setActiveCell(null) 
              }}
            >
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
