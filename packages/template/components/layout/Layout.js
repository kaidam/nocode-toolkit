import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import settingsSelectors from '../../store/selectors/settings'
import systemSelectors from '../../store/selectors/system'
import nocodeSelectors from '../../store/selectors/nocode'

import Cell from './Cell'

const useStyles = makeStyles(theme => ({
  root: {

  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
}))

const Layout = ({
  content_id,
  layout_id,
  simpleMovement,
  divider,
}) => {

  const classes = useStyles()

  const annotations = useSelector(nocodeSelectors.annotations)
  const annotation = annotations[content_id] || {}
  const rawData = annotation[layout_id] || []
  const widgetRenderers = useSelector(settingsSelectors.widgetRenderers)
  const showUI = useSelector(systemSelectors.showUI)

  const rows = useMemo(() => {
    return rawData.map((row, i) => ({
      id: `row-${i}`,
      cells: row,
    }))
  }, [
    rawData,
  ])

  const onDragEnd = useCallback(result => {
    console.log('--------------------------------------------')
    console.dir(result)
  }, [rows])

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
                              return (
                                <Cell
                                  key={ j }
                                  cell={ cell }
                                  layout={ rawData }
                                  widgetRenderers={ widgetRenderers }
                                  showUI={ showUI }
                                  content_id={ content_id }
                                  layout_id={ layout_id }
                                  simpleMovement={ simpleMovement }
                                  rowIndex={ i }
                                  cellIndex={ j }
                                />
                              )
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

export default Layout