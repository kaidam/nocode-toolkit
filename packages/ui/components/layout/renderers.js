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

export const RenderCell = ({
  showUI,
  cellConfig,
  editor,
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
        height: '100%',
        width: '100%',
        position: 'relative',
        minHeight: '45px',
        border: showUI ? '1px solid #f5f5f5' : '',
        display: 'flex',
        alignItems: 'center',
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
          width: '100%',
          padding: `${padding}px`,
          textAlign: align,
          marginRight: showUI ? '40px' : '0px',
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

export default defaultRenderers
