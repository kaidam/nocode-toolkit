import { useMemo } from 'react'

// helper function to create memoized actions
// using getDispatch and getCallback
const Actions = (dispatch, actions) => useMemo(
  () => {
    return Object.keys(actions).reduce((all, name) => {
      const action = actions[name]
      all[name] = (payload) => dispatch(action(payload))
      return all
    }, {})
  },
    [dispatch]
  )

export default Actions