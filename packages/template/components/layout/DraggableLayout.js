import React from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'
import useLayoutCellRenderer from '../hooks/useLayoutCellRenderer'

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
}))

const DraggableLayout = ({
  content_id,
  layout_id,
  layout_data,
  simpleMovement,
  simpleEditor,
  divider,
  editable = true,
  withContext = true,
}) => {

  const actions = Actions(useDispatch(), {
    onLayoutSwapRow: layoutActions.swapRow,
  })

  const classes = useStyles()

  const {
    layout,
    getCell,
  } = useLayoutCellRenderer({
    content_id,
    layout_id,
    layout_data,
    simpleMovement,
    simpleEditor,
    editable,
  })

  const onDragEnd = result => {
    if (!result.destination) return
    const sourceIndex = result.source.index
    const targetIndex = result.destination.index
    actions.onLayoutSwapRow({
      content_id,
      layout_id,
      layout_data,
      sourceIndex,
      targetIndex,
    })
  }

  if(!layout || layout.length <= 0) return null

  const droppable = (
    <Droppable droppableId={`layout-${content_id}`}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {
            layout.map((row, i) => {
              const rowId = row[0].id

              return (
                <Draggable
                  key={ rowId }
                  draggableId={ rowId }
                  index={ i }
                >
                  {(provided, snapshot) => (
                    <div
                      className={ classes.row }
                      ref={ provided.innerRef }
                      { ...provided.draggableProps }
                      { ...provided.dragHandleProps }
                      style={ provided.draggableProps.style }
                    >
                      {
                        row.map((cell, j) => {
                          return getCell({
                            cell,
                            rowIndex: i,
                            cellIndex: j,
                          })
                        })
                      }
                    </div>
                  )}
                </Draggable>
              )
            })
          }
          { provided.placeholder }
        </div>
      )}
    </Droppable>
  )

  const renderContent = withContext ? (
    <DragDropContext onDragEnd={ onDragEnd }>
      { droppable }
    </DragDropContext>
  ) : droppable

  return (
    <>
      { renderContent }
      {
        divider && (
          <Divider />
        )
      }
    </>
  )
}

export default DraggableLayout