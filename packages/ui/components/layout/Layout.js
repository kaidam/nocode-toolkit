import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'
import Suspense from '../system/Suspense'

import cellTypes from './cellTypes'

const CellOptions = lazy(() => import(/* webpackChunkName: "ui" */ './CellOptions'))

const RenderRoot = ({
  children,
}) => {
  return (
    <div>
      { children }
    </div>
  )
}

const RenderRow = ({
  cells,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      {
        cells.map((cell, i) => {
          return (
            <div
              style={{
                flexBasis: '100%',
              }}
              key={ i }
            >
              { cell }
            </div>
          )
        })
      }
    </div>
  )
}

const RenderCell = ({
  showUI,
  cellConfig,
  editor,
  content,
}) => {
  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
        minHeight: '45px',
        border: showUI ? '1px solid #f5f5f5' : '',
      }}
    >
      {
        editor && (
          <div
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              padding: '8px',
            }}
          >
            { editor }
          </div>
        )
      }
      <div
        style={{
          padding: `${(cellConfig.padding || 0) * 8}px`,
        }}
      >
        { content }
      </div>
    </div>
  )
}

const defaultRenderers = {
  root: RenderRoot,
  row: RenderRow,
  cell: RenderCell,
}

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
