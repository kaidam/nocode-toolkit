import core from '@nocode-toolkit/website/src/selectors'

const open = (state, name) => {
  const queryParams = core.router.queryParams(state)
  return queryParams.dialog === name
}

const selectors = {
  open,
}

export default selectors
