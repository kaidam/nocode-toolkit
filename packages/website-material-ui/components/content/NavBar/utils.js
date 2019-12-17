export const getMergedClasses = (baseClasses, overridenClasses, names) => {
  overridenClasses = overridenClasses || {}
  return names.reduce((all, name) => {
    all[name] = overridenClasses[name] || baseClasses[name]
    return all
  }, {})
}

export const eventSink = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}
