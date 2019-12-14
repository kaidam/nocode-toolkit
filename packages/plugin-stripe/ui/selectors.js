const currentValue = state => state.stripe.value

const selectors = {
  currentValue,
  websiteid: (state) => {
    const systemConfig = state.nocode.config
    return systemConfig.websiteId
  },
  apiUrl: (state) => {
    const websiteId = selectors.websiteid(state)
    return `/plugin/api/${websiteId}/stripe`
  }
}

export default selectors