import React from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Divider from '@material-ui/core/Divider'

import { Droppable, Draggable } from 'react-beautiful-dnd'

import useWidgets from '../hooks/useWidgets'
import Actions from '../../utils/actions'

const useStyles = makeStyles(theme => ({
  groupHeaderTitle: {
    fontWeight: 'bold',
  },
  card: {
    cursor: 'pointer',
  },
  avatar: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    backgroundColor: theme.palette.primary.main,
  }
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

  let dragIndex = -1

  return (
    <Droppable droppableId="widgets">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {
            groupedWidgets.map((group, i) => {
              return (
                <React.Fragment key={ `group-${i}` }>
                  <Typography
                    variant="subtitle1"
                    className={ classes.groupHeaderTitle }
                  >
                    { group.title }
                  </Typography>                  
                  {
                    group.items.map((widget, j) => {
                      dragIndex++
                      const CardIcon = widget.icon
                      return (
                        <Draggable
                          key={ widget.globalId }
                          draggableId={ widget.globalId }
                          index={ dragIndex }
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={ provided.innerRef }
                              { ...provided.draggableProps }
                              { ...provided.dragHandleProps }
                              style={ provided.draggableProps.style }
                            >
                              <Card
                                className={ classes.card }
                              >
                                <CardHeader
                                  avatar={
                                    <Avatar className={ classes.avatar }>
                                      <CardIcon />
                                    </Avatar>
                                  }
                                  title={ widget.title }
                                />
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      )
                    })
                  }
                  {
                    i < groupedWidgets.length - 1 ? (
                      <Divider />
                    ) : null
                  }
                </React.Fragment>
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

/*

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

*/