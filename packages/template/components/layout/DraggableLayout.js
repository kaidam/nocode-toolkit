import React, { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'
import useLayoutCellRenderer from '../hooks/useLayoutCellRenderer'

const useStyles = makeStyles(theme => ({
  root: {

  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
}))

const LayoutEditor = ({
  content_id,
  layout_id,
  simpleMovement,
  divider,
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
    simpleMovement,
  })

  const onDragEnd = result => {
    if (!result.destination) return
    const sourceIndex = result.source.index
    const targetIndex = result.destination.index
    actions.onLayoutSwapRow({
      content_id,
      layout_id,
      sourceIndex,
      targetIndex,
    })
  }

  if(!layout || layout.length <= 0) return null

  return (
    <div className={ classes.root }>    
      <DragDropContext onDragEnd={ onDragEnd }>
        <Droppable droppableId="droppable">
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
      </DragDropContext>
      {
        divider && (
          <Divider />
        )
      }
    </div>
  )
}

export default LayoutEditor