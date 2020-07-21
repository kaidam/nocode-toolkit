import React, { lazy } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Suspense from '../system/Suspense'
import widgets from '../../widgets'

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
      width: '100%',
      height: '100%',
      display: 'flex',
      //minHeight: '45px',
      justifyContent: hAlign,
      alignItems: vAlign,
    }
  },
  defaultContent: {
    color: theme.palette.grey[600],
    fontSize: '0.8em'
  }
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
  simpleMovement,
  showUI,
  content_id,
  layout_id,
  rowIndex,
  cellIndex,
  editable,
}) => {

  const settings = cell && cell.data && cell.data.settings ? cell.data.settings : {}
  const classes = useStyles(settings)
  const widget = widgets[cell.type]
  const Renderer = widget ? widget.Render : UnknownTypeRenderer

  let renderedContent = Renderer({
    data: cell.data,
    cell: {
      id: cell.id,
      type: cell.type,
      rowIndex,
      cellIndex,
    }
  })

  if(!renderedContent && editable) {
    renderedContent = (
      <span className={ classes.defaultContent }>{ widget.title }...</span>
    )
  }

  const content = renderedContent && (
    <div
      className={ classes.cell }
    >
      { renderedContent }
    </div>
  )

  const renderContent = showUI && editable ? (
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