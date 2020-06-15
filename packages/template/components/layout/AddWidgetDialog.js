import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
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
  const [ targetLayout, setTargetLayout ] = useState(null)

  const actions = Actions(useDispatch(), {
    onCancel: layoutActions.cancelWidgetWindow,
    onSubmit: layoutActions.acceptWidgetWindow,
  })

  const onSetTargetLayout = useCallback((e) => {
    setTargetLayout(e.target.value)
  })

  const widgetWindow = useSelector(layoutSelectors.widgetWindow)
  const widgets = useWidgets()

  const {
    layouts,
    layout_id,
  } = widgetWindow

  useEffect(() => {
    if(layout_id) {
      setTargetLayout(layout_id)
    }
    else if(layouts && layouts.length > 0) {
      setTargetLayout(layouts[0].id)
    }
  }, [
    layouts,
  ])

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
          <div className={ classes.layoutSelect }>
            
            {
              layouts && layouts.length > 0 && (
                <>
                  add to:&nbsp;&nbsp;
                  <FormControl component="fieldset" className={ classes.select }>
                    <Select
                      value={ targetLayout }
                      onChange={ onSetTargetLayout }
                    >
                      {
                        layouts.map((layout, i) => {
                          return (
                            <MenuItem
                              key={ i }
                              value={ layout.id }
                            >
                              { layout.title || layout.id }
                            </MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </>
              )
            }
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
          widgets.map((group, i) => {
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
                  group.items.map((item, j) => {

                    const CardIcon = item.icon
                    return (
                      <Grid item xs={ 12 } sm={ 3 } key={ `item-${j}-${i}` }>
                        <Card
                          className={ classes.card }
                          onClick={ () => actions.onSubmit({
                            form: item.form,
                            data: item.data,
                            config: item.config,
                            targetLayout,
                          }) }
                        >
                          <CardHeader
                            avatar={
                              <Avatar className={ classes.avatar }>
                                <CardIcon />
                              </Avatar>
                            }
                            title={ item.title }
                          />
                        </Card>
                      </Grid>
                    )
                  })
                }{
                  i < widgets.length - 1 ? (
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
