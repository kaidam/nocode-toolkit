import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'

import Actions from '../../utils/actions'
import layoutActions from '../../store/modules/layout'
import layoutSelectors from '../../store/selectors/layout'

import useWidgets from '../hooks/useWidgets'

import Window from '../dialog/Window'

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flexGrow: 1,
  },
  layoutSelect: {
    flexGrow: 0,
    fontSize: '0.8em',
    fontWeight: 'normal',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  select: {
    width: '200px',
  },
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

const AddWidgetDialog = ({
  
}) => {

  const classes = useStyles()
  
  const actions = Actions(useDispatch(), {
    onCancel: layoutActions.cancelWidgetWindow,
    onSubmit: layoutActions.acceptWidgetWindow,
  })

  const widgetWindow = useSelector(layoutSelectors.widgetWindow)

  const {
    location,
  } = (widgetWindow || {})

  const {
    groupedWidgets,
  } = useWidgets({
    location,
  })

  if(!widgetWindow) return null

  return (
    <Window
      open
      title={(
        <div className={ classes.header }>
          <div className={ classes.headerTitle }>
            <Typography variant="h6">
              Add Widget
            </Typography>
          </div>
        </div>
      )}
      fullHeight
      withCancel
      size="md"
      cancelTitle="Cancel"
      onCancel={ actions.onCancel }
    >
      <Grid container spacing={ 2 }>
        {
          groupedWidgets.map((group, i) => {
            return (
              <React.Fragment key={ `group-${i}` }>
                <Grid item xs={ 12 }>
                  <Typography
                    variant="subtitle1"
                    className={ classes.groupHeaderTitle }
                  >
                    { group.title }
                  </Typography>
                </Grid>
                {
                  group.items.map((widget, j) => {
                    const CardIcon = widget.icon
                    return (
                      <Grid item xs={ 12 } sm={ 3 } key={ `item-${j}-${i}` }>
                        <Card
                          className={ classes.card }
                          onClick={ () => actions.onSubmit({
                            id: widget.id,
                            data: widget.data,
                          }) }
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
                      </Grid>
                    )
                  })
                }{
                  i < groupedWidgets.length - 1 ? (
                    <Grid item xs={ 12 }>
                      <Divider />
                    </Grid>
                  ) : null
                }
              </React.Fragment>
            )
          })
        }
      </Grid>
    </Window>
  )
}

export default AddWidgetDialog
