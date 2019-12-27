import React, { useCallback } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import ContentIcon from './Icon'

const useStyles = makeStyles(theme => createStyles({
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

const SortingEditorList = ({
  ids,
  allItems,
  onUpdate,
}) => {
  const classes = useStyles()
  const onDragEnd = useCallback(result => {
    if (!result.destination) return
    const startIndex = result.source.index
    const endIndex = result.destination.index
    const newIds = Array.from(ids)
    const [removed] = newIds.splice(startIndex, 1)
    newIds.splice(endIndex, 0, removed)
    onUpdate(newIds)
  }, [ids, onUpdate])

  return (
    <DragDropContext onDragEnd={ onDragEnd }>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <List>
              {
                ids.map((id, index) => {
                  const item = allItems[id]
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
                            <ListItemIcon
                              className={ classes.menuIcon }
                            >
                              <ContentIcon
                                item={ item }
                                className={ classes.normalListItem }
                              />
                            </ListItemIcon>
                            <ListItemText
                              classes={{
                                primary: classes.normalListItem
                              }}
                              primary={ item.data.name }
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

export default SortingEditorList
