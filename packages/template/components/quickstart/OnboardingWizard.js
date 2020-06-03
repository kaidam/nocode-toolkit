import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import Promise from 'bluebird'
import { makeStyles } from '@material-ui/core/styles'

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

const ONBOARDING_WAIT_DELAY = 10


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
      maxWidth: '400px',
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
  }
})

const OnboardingWizard = ({
  children,
}) => {

  const classes = useStyles()
  const store = useStore()
  const dispatch = useDispatch()
  const website = useSelector(systemSelectors.website)

  const processedSteps = useRef({})

  const [ focusElement, setFocusElement ] = useState({})
  const [ active, setActive ] = useState(false)
  const [ onboardingConfig, setOnboardingConfig ] = useState(null)
  const [ triggerStep, setTriggerStep ] = useState(null)
  const [ currentStep, setCurrentStep ] = useState(null)
  const [ arrowRef, setArrowRef ] = React.useState(null)

  const onSetFocusElement = useCallback((element) => {
    if(!currentStep || currentStep.element != element.id) return
    setFocusElement(element)
  }, [
    currentStep,
  ])

  const cancelOnboarding = useCallback(async () => {
    if(currentStep && currentStep.cleanup) {
      await currentStep.cleanup(store.dispatch, store.getState)
    }
    setCurrentStep(null)
    setFocusElement({})
    await dispatch(systemActions.updateWebsiteMeta({
      onboardingActive: false,
    }))
  }, [
    currentStep,
  ])

  const incrementStep = useCallback(async () => {
    if(currentStep && currentStep.cleanup) {
      await currentStep.cleanup(store.dispatch, store.getState)
    }
    setFocusElement({})
    const currentIndex = onboardingConfig.steps.findIndex(step => step.id == currentStep.id)
    if(currentIndex >= onboardingConfig.steps.length - 1) {
      cancelOnboarding()
      return
    }
    setTriggerStep(onboardingConfig.steps[currentIndex + 1])
  }, [
    onboardingConfig,
    currentStep,
    cancelOnboarding,
  ])

  const progressOnboarding = useCallback(() => {
    if(currentStep.noProgress) return
    incrementStep()
  }, [
    currentStep,
    incrementStep,
  ])

  // this triggers the next step from the onboarding overlay
  // and not the UI element itself
  // if the current focus element has a handler - run it
  const handleCurrentStep = useCallback(() => {
    if(currentStep && currentStep.type == 'focus' && focusElement) {
      if(focusElement.handler) {
        focusElement.handler()
      }
    }
    progressOnboarding()
  }, [
    store,
    focusElement,
    currentStep,
    progressOnboarding,
  ])

  useEffect(() => {
    if(!website || !website.meta) return
    setActive(website.meta.onboardingActive || false)
    const config = library.onboarding[website.meta.quickstart] || library.onboarding.default
    setOnboardingConfig(config)
    setTriggerStep(config.steps[0])
  }, [
    website,
  ])

  useEffect(() => {
    if(!triggerStep) return
    if(processedSteps.current[triggerStep.id]) return
    processedSteps.current[triggerStep.id] = true
    const handler = async () => {
      if(triggerStep.initialise) {
        await triggerStep.initialise(store.dispatch, store.getState)
      }
      setCurrentStep(triggerStep)
    }
    handler()
  }, [
    triggerStep,
  ])

  useEffect(() => {
    if(!currentStep) return
    const handler = async () => {
      if(currentStep.type == 'wait') { 
        let passed = false
        while(!passed) {
          passed = await currentStep.handler(store.dispatch, store.getState)
          if(!passed) await Promise.delay(ONBOARDING_WAIT_DELAY)
        }
        if(passed.cancel) {
          cancelOnboarding()
        }
        else {
          incrementStep()
        }
        
      }
    }
    handler()
  }, [
    currentStep,
  ])

  if(!active) return children

  let info = null

  if(currentStep && focusElement && currentStep.element == focusElement.id) {
    if(focusElement.ref && focusElement.ref.current) {
      const padding = typeof(focusElement.padding) === 'number' ?
        {
          left: focusElement.padding,
          right: focusElement.padding,
          top: focusElement.padding,
          bottom: focusElement.padding,
        } :
        focusElement.padding

      const infoContent = (
        <>
          <DialogTitle>{ currentStep.title }</DialogTitle>
          <DialogContent>
            {
              (currentStep.description || []).map((text, i) => {
                return (
                  <DialogContentText key={ i }>{ text }</DialogContentText>
                )
              })
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={ cancelOnboarding }>
              Skip
            </Button>
            {
              !currentStep.noSubmit && (
                <Button onClick={ handleCurrentStep } color="secondary">
                  Next
                </Button>
              )
            }
          </DialogActions>
        </>
      )

      info = (
        <>
          <Hidden smDown>
            <Popper 
              open
              anchorEl={ focusElement.ref.current }
              placement="right"
              className={ classes.popper }
              modifiers={{
                arrow: {
                  enabled: true,
                  element: arrowRef,
                },
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
              onClick={ cancelOnboarding }
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
        setFocusElement: onSetFocusElement,
        progressOnboarding,
      }}
    >
      { children }
      { info }
    </OnboardingContext.Provider>
  )
}

export default OnboardingWizard
