import React from 'react'

const OnboardingContext = React.createContext({
  active: false,
  focusElements: {},
  setFocusElement: () => {},
})

export default OnboardingContext
