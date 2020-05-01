import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'
import Window from '../dialog/Window'

import library from '../../library'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  contentRow: {
    marginBottom: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    height: '100%',
  },
  title: {
    fontSize: 14,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
}))

const QuickStartDialog = ({

}) => {

  const classes = useStyles()

  const quickstartWindow = useSelector(uiSelectors.quickstartWindow)

  const actions = Actions(useDispatch(), {
    onCancel: uiActions.cancelQuickstartWindow,
    onSubmit: uiActions.acceptQuickstartWindow,
  })

  const onCloseWindow = useCallback(() => {
    actions.onCancel()
  }, [])

  const onChooseQuickstart = useCallback((quickstart) => {
    console.log('--------------------------------------------')
    console.log('--------------------------------------------')
    console.dir(quickstart)
  }, [])

  return (
    <Window
      open
      fullHeight
      withCancel
      title="Choose your template..."
      size="lg"
      cancelTitle="Skip"
      onCancel={ () => onChooseQuickstart('none') }
    >
      <div className={ classes.contentRow }>
        <Typography gutterBottom>To get started - choose what type of website you want to create:</Typography>
      </div>
      <div className={ classes.contentRow }>
        <Grid container spacing={ 2 }>
          {
            library.quickstarts.map((quickstart, i) => {
              return (
                <Grid item key={ i } xs={ 12 } md={ 3 }>
                  <Card
                    className={classes.card}
                  >
                    <CardContent>
                      <div className={ classes.title }>
                        <Avatar className={ classes.avatar }>{ quickstart.title.charAt(0).toUpperCase() }</Avatar>
                        <Typography>
                         { quickstart.title }
                        </Typography>
                      </div>
                      <div className={ classes.description }>
                        <Typography variant="body2" color="textSecondary">
                          { quickstart.description }
                        </Typography>
                      </div>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={ () => onChooseQuickstart(quickstart.id) }
                      >
                        Choose...
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })
          }
        </Grid>
      </div>
      <div className={ classes.contentRow }>
        <Typography gutterBottom>or <a href="#" onClick={ () => onChooseQuickstart('none') }>skip this step</a></Typography>
      </div>
    </Window>
  )
}

export default QuickStartDialog