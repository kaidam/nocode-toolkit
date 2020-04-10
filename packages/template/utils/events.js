const cancelEvent = (e) => {
  if(!e) return
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
  e.preventDefault()
}

const utils = {
  cancelEvent,
}

export default utils