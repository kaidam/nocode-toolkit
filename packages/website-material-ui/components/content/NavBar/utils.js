export const getMergedClasses = (baseClasses, overridenClasses) => {
  overridenClasses = overridenClasses || {}
  return Object.keys(baseClasses).reduce((all, name) => {
    all[name] = [
      baseClasses[name],
      overridenClasses[name],
    ]
      .filter(c => c)
      .join(' ')
    return all
  }, {})
}

export const eventSink = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}
