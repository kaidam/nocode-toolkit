import React, { useRef } from 'react'

const OnboardingContext = React.createContext({
  currentStep: null,
  setFocusElements: () => {},
  progressOnboarding: () => {},
})

export default OnboardingContext
