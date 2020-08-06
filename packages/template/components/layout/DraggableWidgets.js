import React from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
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
    marginBottom: theme.spacing(1),
  },
  card: {
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    backgroundColor: '#f5f5f5',   
  },
  cardHeader: {
    padding: theme.spacing(1),
  },
  avatar: {
    width: '30px',
    height: '30px',
    color: theme.palette.getContrastText(theme.palette.primary.main),
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    fontSize: '0.8em',
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }
}))

const DraggableWidgets = ({
  onWidgetClick,
}) => {
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
                              onClick={ () => {
                                onWidgetClick({
                                  type: widget.globalId,
                                })
                              } }
                            >
                              <Tooltip title={ widget.description }>
                                <Card
                                  className={ classes.card }
                                >
                                  <CardHeader
                                    className={ classes.cardHeader }
                                    avatar={
                                      <Avatar className={ classes.avatar }>
                                        <CardIcon className={ classes.icon } />
                                      </Avatar>
                                    }
                                    title={ widget.title }
                                  />
                                </Card>
                              </Tooltip>
                            </div>
                          )}
                        </Draggable>
                      )
                    })
                  }
                  {
                    i < groupedWidgets.length - 1 ? (
                      <Divider className={ classes.divider } />
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