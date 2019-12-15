const selectors = {
  values: (state) => state.contactform.values,
  errors: (state) => state.contactform.errors,
  isValid: (state) => {
    const errors = selectors.errors(state)
    return Object.keys(errors).length <= 0
  },
  websiteid: (state) => {
    const systemConfig = state.nocode.config
    return systemConfig.websiteId
  },
  apiUrl: (state) => {
    const websiteId = selectors.websiteid(state)
    return `/plugin/api/${websiteId}/contact-form`
  }
}

export default selectors