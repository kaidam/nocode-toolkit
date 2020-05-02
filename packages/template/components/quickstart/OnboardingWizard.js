import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import FocusElementOverlay from '../widgets/FocusElementOverlay'

import systemSelectors from '../../store/selectors/system'
import OnboardingContext from '../contexts/onboarding'

import library from '../../library'


const useStyles = makeStyles(theme => {
  return {
    popper: {
      marginLeft: '20px',
      zIndex: 5000,
    },
  }
})

const OnboardingWizard = ({
  children,
}) => {

  const classes = useStyles()
  const website = useSelector(systemSelectors.website)
  const [ focusElements, setFocusElements ] = useState({})
  const [ active, setActive ] = useState(false)
  const [ onboardingConfig, setOnboardingConfig ] = useState(null)
  const [ currentStep, setCurrentStep ] = useState(null)

  const setFocusElement = useCallback((name, element) => {
    const newElements = Object.assign({}, focusElements, {
      [name]: element,
    })
    setFocusElements(newElements)
  }, [
    focusElements,
  ])

  useEffect(() => {
    if(!website || !website.meta) return
    setActive(website.meta.onboardingActive || false)
    const config = library.onboarding[website.meta.quickstart] || library.onboarding.default
    setOnboardingConfig(config)
    setCurrentStep(config.steps[0])
  }, [
    website,
  ])

  let overlay = null
  let info = null

  if(currentStep && currentStep.type == 'focus' && focusElements[currentStep.element]) {
    const focusElement = focusElements[currentStep.element]

    const padding = typeof(focusElement.padding) === 'number' ?
      {
        left: focusElement.padding,
        right: focusElement.padding,
        top: focusElement.padding,
        bottom: focusElement.padding,
      } :
      focusElement.padding

    overlay = (
      <FocusElementOverlay
        contentRef={ focusElement.ref }
        padding={ padding }
      />
    )

    info = (
      <Popper 
        open
        anchorEl={ focusElement.ref.current }
        placement="right"
        className={ classes.popper }
      >
        <Paper>
          <Typography>The content of the Popper.</Typography>
        </Paper>
      </Popper>
    )
  }

  return (
    <OnboardingContext.Provider
      value={{
        active,
        focusElements,
        setFocusElement,
      }}
    >
      { children }
      { overlay }
      { info }
    </OnboardingContext.Provider>
  )
}

export default OnboardingWizard
