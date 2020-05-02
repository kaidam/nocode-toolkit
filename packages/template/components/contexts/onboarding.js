import React, { useRef } from 'react'

const OnboardingContext = React.createContext({
  currentStep: null,
  setFocusElement: () => {},
  progressOnboarding: () => {},
})

export default OnboardingContext
