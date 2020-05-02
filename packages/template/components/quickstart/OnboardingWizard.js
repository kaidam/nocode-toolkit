import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import FocusElementOverlay from '../widgets/FocusElementOverlay'

import systemSelectors from '../../store/selectors/system'
import OnboardingContext from '../contexts/onboarding'

import library from '../../library'

const OnboardingWizard = ({
  children,
}) => {

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

  if(currentStep && currentStep.type == 'focus' && focusElements[currentStep.element]) {
    const focusElement = focusElements[currentStep.element]

    overlay = (
      <FocusElementOverlay
        contentRef={ focusElement.ref }
        padding={ focusElement.padding }
      />
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
    </OnboardingContext.Provider>
  )
}

export default OnboardingWizard
