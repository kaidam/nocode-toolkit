import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import Actions from '../../utils/actions'
import contentActions from '../../store/modules/content'

const useStyles = makeStyles(theme => {
  return {
    navbar: ({vertical}) => ({
      listStyleType: 'none',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      fontSize: '1em',
      textAlign: 'right',
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      alignItems: vertical ? 'flex-start' : 'center',
      justifyContent: 'flex-end',
    }),
    draggableDiv: ({vertical}) => ({
      width: vertical ? '100%' : '',
      display: vertical ? 'block' : 'inline-block',
    }),
  }
})

const DraggableNavBar = ({

  section,
  items,
  contrast,
  vertical,
  align,
  getNavbarItem,

}) => {
  
  const classes = useStyles({
    vertical,
  })

  const actions = Actions(useDispatch(), {
    onUpdateAnnotation: contentActions.updateAnnotation,
  })

  const ids = items.map(item => item.id)

  const onDragEnd = result => {
    if (!result.destination) return

    const startIndex = result.source.index
    const endIndex = result.destination.index

    const newIds = [].concat(ids)
    const [removed] = newIds.splice(startIndex, 1)
    newIds.splice(endIndex, 0, removed)

    actions.onUpdateAnnotation({
      id: `section:${section}`,
      data: {
        sorting: {
          type: 'manual',
          ids: newIds,
        },
      },
      snackbarMessage: 'sorting updated',
      reload: false,
    })
  }

  return (
    <nav>
      <DragDropContext
        onDragEnd={ onDragEnd }
      >
        <Droppable
          direction={ vertical ? 'vertical' : 'horizontal' }
          droppableId={ `navbar-${section}` }
          type={ `navbar-${section}` }
        >
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <ul className={ classes.navbar }>
                {
                  items.map((item, i) => {
                    return (
                      <Draggable
                        key={ `navbar-${section}-${item.id}` }
                        draggableId={ `navbar-${section}-${item.id}` }
                        index={ i }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={ provided.innerRef }
                            { ...provided.draggableProps }
                            { ...provided.dragHandleProps }
                            style={ provided.draggableProps.style }
                            className={ classes.draggableDiv }
                          >
                            { getNavbarItem(item, i) }
                          </div>
                        )}
                      </Draggable>
                    )
                  })
                }
                { provided.placeholder }
              </ul>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </nav>
  )

}

export default DraggableNavBar