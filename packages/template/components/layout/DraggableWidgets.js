import React from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import useWidgets from '../hooks/useWidgets'
import Actions from '../../utils/actions'

const useStyles = makeStyles(theme => ({
  
}))

const DraggableWidgets = ({
  
}) => {

  const actions = Actions(useDispatch(), {
    
  })

  const classes = useStyles()

  const {
    groupedWidgets,
  } = useWidgets({
    location: 'document',
  })

  const allWidgets = groupedWidgets.reduce((all, group) => {
    return all.concat(group.items)
  }, [])

  return (
    <Droppable droppableId="dragWidgets">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {
            allWidgets.map((widget, i) => {
              return (
                <Draggable
                  key={ widget.globalId }
                  draggableId={ widget.globalId }
                  index={ i }
                >
                  {(provided, snapshot) => (
                    <div
                      ref={ provided.innerRef }
                      { ...provided.draggableProps }
                      { ...provided.dragHandleProps }
                      style={ provided.draggableProps.style }
                    >
                      { widget.title }
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
}

export default DraggableWidgets