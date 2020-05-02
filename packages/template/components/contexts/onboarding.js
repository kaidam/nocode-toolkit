import React from 'react'

const OnboardingContext = React.createContext({
  active: false,
  focusElements: {},
  setFocusElement: () => {},
  progressOnboarding: () => {},
})

export default OnboardingContext
