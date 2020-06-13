import React, { useCallback, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'

import Actions from '../../utils/actions'
import uiActions from '../../store/modules/ui'
import uiSelectors from '../../store/selectors/ui'
import systemSelectors from '../../store/selectors/system'
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
    maxWidth: 345,
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
  media: {
    height: 200,
  },
}))

const DriveExperience = ({
  onSetDriveExperience,
}) => {
  const classes = useStyles()
  return (
    <div>
      <div className={ classes.contentRow }>
        <Typography gutterBottom>We use Google Docs as the content for your new site. So let us know below how familiar you are with Google Docs and we will adjust the content we load in to your site to make it as easy as possible for you!</Typography>
      </div>
      <div className={ classes.contentRow }>
        <Typography gutterBottom variant="subtitle1">What experience do you have with Google Docs?</Typography>
      </div>
      <div className={ classes.contentRow }>
        <Grid container spacing={ 2 }>
          {
            DRIVE_EXPERIENCE_LEVELS.map((experience, i) => {
              return (
                <Grid item key={ i } xs={ 12 } md={ 3 }>
                  <Card
                    className={classes.card}
                  >
                    <CardActionArea
                      onClick={ () => onSetDriveExperience(experience.value) }
                    >
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                          { experience.title }
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={ () => onSetDriveExperience(experience.value) }
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
    </div>
  )
}

const Template = ({
  onSetQuickstart,
}) => {
  const classes = useStyles()
  return (
    <div>
      <div className={ classes.contentRow }>
        <Typography gutterBottom>All our site features are optional and you can toggle them off and on. So don't worry if you change your mind.</Typography>
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
                    <CardActionArea
                      onClick={ () => onSetQuickstart(quickstart.id) }
                    >
                      <CardMedia
                        className={classes.media}
                        image={ quickstart.image }
                        title={ quickstart.title }
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          { quickstart.title }
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          { quickstart.description }
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={ () => onSetQuickstart(quickstart.id) }
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
    </div>
  )
}

const STEPS = {
  driveExperience: {
    title: 'How well do you know Google Docs?',
    component: DriveExperience,
  },
  quickstart: {
    title: 'What are you looking to publish today?',
    component: Template,
  },
}

const DRIVE_EXPERIENCE_LEVELS = [{
  title: 'Absolutely None',
  value: 'none',  
}, {
  title: 'I\'ve used it a bit',
  value: 'some',
}, {
  title: 'Boafide Superuser',
  value: 'lots',
}]

const QuickStartDialog = ({

}) => {

  const classes = useStyles()
  const user = useSelector(systemSelectors.user)

  const [ step, setStep ] = useState('quickstart')
  const [ quickstart, setQuickstart ] = useState('none')
  const [ driveExperience, setDriveExperience ] = useState('none')

  const actions = Actions(useDispatch(), {
    onSubmit: uiActions.acceptQuickstartWindow,
  })

  const onSetQuickstart = useCallback((value) => {
    setQuickstart(value)
    setStep('driveExperience')
  }, [
    driveExperience,
  ])

  const onSetDriveExperience = useCallback((value) => {
    setDriveExperience(value)
    setStep('submit')
  })

  const onSubmit = useCallback(() => {
    setStep('submit')
  }, [])

  useEffect(() => {
    if(step == 'submit') {
      actions.onSubmit({
        quickstart,
        driveExperience,
      })
    }
  }, [
    step,
    quickstart,
    driveExperience,
  ])

  const STEP = STEPS[step]

  if(!STEP) return null

  const RenderComponent = STEP.component

  return (
    <Window
      open
      fullHeight
      withCancel
      title={ STEP.title }
      size="lg"
      cancelTitle="Skip"
      onCancel={ onSubmit }
    >
      
      <div className={ classes.contentRow }>
        <RenderComponent
          onSetDriveExperience={ onSetDriveExperience }
          onSetDriveMode={ onSetDriveMode }
          onSetQuickstart={ onSetQuickstart }
        />
        <Typography gutterBottom>or <a href="#" onClick={ onSubmit }>skip</a></Typography>
      </div>
    </Window>
  )
}

export default QuickStartDialog