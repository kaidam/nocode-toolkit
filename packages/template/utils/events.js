const cancelEvent = (e) => {
  if(!e) return
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
  e.preventDefault()
}

const cancelEventHandler = (handler) => (e) => {
  cancelEvent(e)
  handler()
}

const utils = {
  cancelEvent,
  cancelEventHandler,
}

export default utils