import React, { lazy } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Suspense from '../system/Suspense'

const EditableCell = lazy(() => import(/* webpackChunkName: "ui" */ './EditableCell'))

const useStyles = makeStyles(theme => ({
  root: {
    flexBasis: '100%',
    flex: 1,
  },
  cell: (settings) => ({
    padding: settings.padding,
  }),
}))

const UnknownTypeRenderer = ({
  type,
}) => {
  return (
    <div>
      Error unknown cell type {type}
    </div>
  )
}

const Cell = ({
  cell,
  layout,
  widgetRenderers,
  showUI,
  content_id,
  layout_id,
  rowIndex,
  cellIndex,
  currentCellId,
  setCurrentCellId,
  getAddMenu,
}) => {

  const classes = useStyles(cell.settings || {})

  const id = [rowIndex,cellIndex].join('.')
  const Renderer = widgetRenderers[cell.type] || UnknownTypeRenderer

  const content = (
    <div
      className={ classes.cell }
    >
      <Renderer
        data={ cell.data }
        cell={{
          id,
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
        id={ id }
        layout={ layout }
        content_id={ content_id }
        layout_id={ layout_id }
        rowIndex={ rowIndex }
        cellIndex={ cellIndex }
        currentCellId={ currentCellId }
        setCurrentCellId={ setCurrentCellId }
        getAddMenu={ getAddMenu }
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