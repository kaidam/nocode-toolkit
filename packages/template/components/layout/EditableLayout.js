import React, { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'
import useLayoutGrid from '../hooks/useLayoutGrid'

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
  } = useLayoutGrid({
    content_id,
    layout_id,
    simpleMovement,
  })

  const rows = useMemo(() => {
    return layout.map((row, i) => ({
      id: `row-${i}`,
      index: i,
      cells: row,
    }))
  }, [
    layout,
  ])

  const onDragEnd = useCallback(result => {
    if (!result.destination) return
    const sourceIndex = result.source.index
    const targetIndex = result.destination.index
    actions.onLayoutSwapRow({
      content_id,
      layout_id,
      sourceIndex,
      targetIndex,
    })
  }, [
    layout,
    content_id,
    layout_id,
  ])

  if(!rows || rows.length <= 0) return null

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
                rows.map((row, i) => {
                  return (
                    <Draggable
                      key={ row.id }
                      draggableId={ row.id }
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
                            row.cells.map((cell, j) => {
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