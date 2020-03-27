import React, { useCallback, useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles(theme => createStyles({
  root: {
    margin: theme.spacing(2),
    border: '1px solid #cccccc',
  },
  menuItem: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(0.2),
    marginBottom: theme.spacing(0.2),
  },
  menuIcon: {
    marginRight: '0px',
  },
  normalListItem: {
    color: theme.palette.grey[600],
  },
}))

const DragDropList = ({
  items,
  onChange,
}) => {
  const classes = useStyles()
  const onDragEnd = useCallback(result => {
    if (!result.destination) return
    const startIndex = result.source.index
    const endIndex = result.destination.index
    const newIds = items.map(item => item.id)
    const [removed] = newIds.splice(startIndex, 1)
    newIds.splice(endIndex, 0, removed)
    onChange(newIds)
  }, [items, onChange])

  return (
    <DragDropContext onDragEnd={ onDragEnd }>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            className={ classes.root }
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <List>
              {
                items.map((item, index) => {
                  return (
                    <Draggable key={ item.id } draggableId={ item.id } index={ index }>
                      {(provided, snapshot) => (
                        <div
                          ref={ provided.innerRef }
                          { ...provided.draggableProps }
                          { ...provided.dragHandleProps }
                          style={ provided.draggableProps.style }
                        >
                          <ListItem
                            dense
                            className={ classes.menuItem }
                          >
                            <ListItemText
                              classes={{
                                primary: classes.normalListItem
                              }}
                              primary={ item.name }
                            />
                          </ListItem>
                        </div>
                      )}
                    </Draggable>
                  )
                })
              }
              { provided.placeholder }
            </List>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DragDropList
