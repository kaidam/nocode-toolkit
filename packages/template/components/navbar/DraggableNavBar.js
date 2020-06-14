import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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

  const onDragEnd = useCallback(result => {
    console.log('--------------------------------------------')
    console.dir(result)
  }, [

  ])

  return (
    <nav>
      <DragDropContext
        onDragEnd={ onDragEnd }
      >
        <Droppable droppableId={ `navbar-${section}` } type={ `navbar-${section}` }>
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
                        key={ item.id }
                        draggableId={ item.id }
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