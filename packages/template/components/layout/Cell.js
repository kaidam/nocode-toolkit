import React, { lazy } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Suspense from '../system/Suspense'

const EditableCell = lazy(() => import(/* webpackChunkName: "ui" */ './EditableCell'))

const useStyles = makeStyles(theme => ({
  root: {
    flexBasis: '100%',
    flex: 1,
  },
  cell: ({
    horizontal_align,
    vertical_align,
    padding,
  }) => {

    let hAlign = horizontal_align
    let vAlign = vertical_align

    if(hAlign == 'left') hAlign = 'flex-start'
    else if(hAlign == 'right') hAlign = 'flex-end'

    if(vAlign == 'top') vAlign = 'flex-start'
    else if(vAlign == 'bottom') vAlign = 'flex-end'

    return {
      padding: padding,
      height: '100%',
      display: 'flex',
      minHeight: '45px',
      justifyContent: hAlign,
      alignItems: vAlign,
    }
  },
}))

const UnknownTypeRenderer = ({
  cell,
}) => {
  return (
    <div>
      Error unknown cell type {cell.type}
    </div>
  )
}

const Cell = ({
  cell,
  layout,
  widgetRenderers,
  simpleMovement,
  showUI,
  content_id,
  layout_id,
  rowIndex,
  cellIndex,
}) => {

  const classes = useStyles(cell.settings || {})
  const Renderer = widgetRenderers[cell.type] || UnknownTypeRenderer

  const content = (
    <div
      className={ classes.cell }
    >
      <Renderer
        data={ cell.data }
        cell={{
          id: cell.id,
          type: cell.type,
          rowIndex,
          cellIndex,
        }}
      />
    </div>
  )

  const renderContent = showUI ? (
    <Suspense>
      <EditableCell
        id={ cell.id }
        cell={ cell }
        layout={ layout }        
        content_id={ content_id }
        simpleMovement={ simpleMovement }
        layout_id={ layout_id }
        rowIndex={ rowIndex }
        cellIndex={ cellIndex }
      >
        { content }
      </EditableCell>
    </Suspense>
  ) : content

  return (
    <div
      className={ classes.root }
    >
      { renderContent }
    </div>
  )
}

export default Cell