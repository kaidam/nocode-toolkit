import React from 'react'

export const RenderRoot = ({
  children,
}) => {
  return (
    <div>
      { children }
    </div>
  )
}

export const RenderRow = ({
  showUI,
  cells,
  rowIndex,
  rowCount,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        borderTop: showUI ? '1px dotted #e5e5e5' : '',
        borderLeft: showUI ? '1px dotted #e5e5e5' : '',
        borderRight: showUI ? '1px dotted #e5e5e5' : '',
        borderBottom: showUI && rowIndex >= rowCount - 1 ? '1px dotted #e5e5e5' : '',
      }}
    >
      {
        cells.map((cell, i) => {
          return (
            <div
              style={{
                flexBasis: '100%',
                flex: 1,
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

export const RenderCell = ({
  content,
  cell,
}) => {

  const settings = cell.settings || {}
  const align = settings.align || 'left'
  const padding = typeof(settings.padding) != 'undefined' ?
    settings.padding :
    8
  
  return (
    <div
      style={{
        padding: `${padding}px`,
        textAlign: align,
      }}
    >
      { content }
    </div>
  )
}

const defaultRenderers = {
  root: RenderRoot,
  row: RenderRow,
  cell: RenderCell,
}

export default defaultRenderers
