import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import Hidden from '@material-ui/core/Hidden'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import FocusElementOverlay from '../widgets/FocusElementOverlay'

import systemSelectors from '../../store/selectors/system'
import systemActions from '../../store/modules/system'

import OnboardingContext from '../contexts/onboarding'

import library from '../../library'

const useStyles = makeStyles(theme => {
  return {
    popper: {
      marginLeft: '20px',
      zIndex: 5000,
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '0 1em 1em 1em',
          borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
        },
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '1em 1em 0 1em',
          borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
        },
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 1em 1em 0',
          borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
        },
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 0 1em 1em',
          borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
        },
      },
    },
    paper: {
      maxWidth: '450px',
      overflow: 'auto',
    },
    arrow: {
      position: 'absolute',
      fontSize: 7,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
      },
    },
    title: {
      margin: 0,
      padding: theme.spacing(2),
    },
    stepTitle: {
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialogContent: {
      minWidth: '400px',
    },
  }
})

const OnboardingWizard = ({
  children,
}) => {

  const classes = useStyles()
  const store = useStore()
  const dispatch = useDispatch()
  const website = useSelector(systemSelectors.website)

  const theme = useTheme()
  const isBigScreen = useMediaQuery(theme.breakpoints.up('md'))

  const focusElements = useRef({})
  const [ _, setFocusElementCount ] = useState(0)
  const [ onboardingConfig, setOnboardingConfig ] = useState(null)

  const [ currentStepIndex, setCurrentStepIndex ] = useState(null)
  const [ targetStepIndex, setTargetStepIndex ] = useState(null)
  const [ arrowRef, setArrowRef ] = React.useState(null)

  /*
  
    work out progress index
  
  */
  const currentStep = onboardingConfig ? onboardingConfig.steps[currentStepIndex] : null
  const totalSteps = onboardingConfig ? onboardingConfig.steps.filter(s => s.type == 'focus').length : 0
  const adjustedCurrentIndex = onboardingConfig ? onboardingConfig.steps.filter((s, i) => s.type == 'focus' && i < currentStepIndex).length : 0
  const isLastStep = (adjustedCurrentIndex + 1) >= totalSteps
  const stepTitle = `Step ${adjustedCurrentIndex + 1} of ${totalSteps}`

  const focusElement = currentStep ? focusElements.current[currentStep.id] : null

  /*
  
    triggered by the various UI elements
  
  */
  const onSetFocusElements = (elements) => {
    setTimeout(() => {
      const newElements = Object.assign({}, focusElements.current, elements)
      focusElements.current = newElements
      setFocusElementCount(Object.keys(newElements).length)
    }, 1)
  }

  const cancelOnboarding = () => {
    setTargetStepIndex(onboardingConfig.steps.length)
  }

  const progressOnboarding = () => {
    if(currentStepIndex >= onboardingConfig.steps.length - 1) {
      cancelOnboarding()
      return
    }
    setTargetStepIndex(currentStepIndex + 1)
  }

  useEffect(() => {
    const handler = async () => {
      if(onboardingConfig && targetStepIndex >= onboardingConfig.steps.length) {
        setCurrentStepIndex(targetStepIndex)
        if(currentStep && currentStep.cleanup) {
          await currentStep.cleanup(store.dispatch, store.getState)
        }
        await dispatch(systemActions.updateWebsiteMeta({
          onboardingActive: false,
        }))
      }
      else {
        if(currentStep && currentStep.cleanup) {
          await currentStep.cleanup(store.dispatch, store.getState)
        }
        const nextStep = onboardingConfig ? onboardingConfig.steps[targetStepIndex] : null
        if(nextStep && nextStep.initialise) {
          await nextStep.initialise(store.dispatch, store.getState)
        }
        setCurrentStepIndex(targetStepIndex)
      }
    }
    handler()
  }, [
    targetStepIndex,
  ])

  useEffect(() => {
    if(!website || !website.meta) return
    const config = library.onboarding[website.meta.quickstart] || library.onboarding.default
    setOnboardingConfig(config)
    setTargetStepIndex(0)
  }, [
    website,
  ])

  let info = null

  if(currentStep && focusElement && currentStep.id == focusElement.id) {
    if(targetStepIndex == currentStepIndex && focusElement.ref && focusElement.ref.current) {
      const padding = typeof(focusElement.padding) === 'number' ?
        {
          left: focusElement.padding,
          right: focusElement.padding,
          top: focusElement.padding,
          bottom: focusElement.padding,
        } :
        focusElement.padding

      const Description = isBigScreen ?
        currentStep.description :
        currentStep.smallDescription

      const infoContent = (
        <>
          <DialogTitle disableTypography className={classes.title}>
            <Typography variant="h6">{ currentStep.title }</Typography>
            <Typography className={classes.stepTitle}>{ stepTitle }</Typography>
          </DialogTitle>
          <DialogContent className={ classes.dialogContent }>
            {
              typeof(Description) == 'function' ? 
                <Description store={store} /> :
                (Description || []).map((row, i) => {
                  return (
                    <DialogContentText key={ i }>{ row }</DialogContentText>
                  )
                })
            }
          </DialogContent>
          {
            isLastStep ? (
              <DialogActions>
                <Button onClick={ progressOnboarding } color="secondary">
                  Finish
                </Button>
              </DialogActions>
            ) : (
              <DialogActions>
                <Button onClick={ cancelOnboarding }>
                  Close
                </Button>
                <Button onClick={ progressOnboarding } color="secondary">
                  Next
                </Button>
              </DialogActions>
            )
          }
        </>
      )

      info = (
        <>
          <Hidden smDown>
            <Popper 
              open
              anchorEl={ focusElement.ref.current }
              placement={ currentStep.placement || 'right' }
              className={ classes.popper }
              modifiers={{
                arrow: {
                  enabled: true,
                  element: arrowRef,
                },
                offset: {
                  offset: currentStep.offset || '0',
                }
              }}
            >
              <span className={classes.arrow} ref={setArrowRef} />
              <Paper className={classes.paper}>
                { infoContent }
              </Paper>
            </Popper>
            <FocusElementOverlay
              contentRef={ focusElement.ref }
              padding={ padding }
              zIndex={ 1301 }
              disableClick={ currentStep.disableClick ? true : false }
            />
          </Hidden>
          <Hidden mdUp>
            <Dialog
              open
              onClose={ cancelOnboarding }
            >
              { infoContent }
            </Dialog>
          </Hidden>
        </>
      )
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setFocusElements: onSetFocusElements,
        progressOnboarding,
      }}
    >
      { children }
      { info }
    </OnboardingContext.Provider>
  )
}

export default OnboardingWizard
