import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import routerActions from './router'

import { dialog as initialState } from '../initialState'

const prefix = 'dialog'

const reducers = {
  
}

const sideEffects = {
  open: (name, params = {}) => (dispatch, getState) => {
    const newParams = Object.assign({}, params, {open:'yes'})
    const mappedParams = Object.keys(newParams).reduce((all, id) => {
      all[`dialog_${name}_${id}`] = newParams[id]
      return all
    }, {})
    dispatch(routerActions.addQueryParams(mappedParams))
  },
  replace: (name, params = {}) => (dispatch, getState) => {
    dispatch(actions.closeAll())
    dispatch(actions.open(name, params))
  },
  close: (name) => (dispatch, getState) => {
    dispatch(routerActions.removeQueryParams(id => id.indexOf(`dialog_${name}_`) == 0 ? false : true))
  },
  closeAll: () => (dispatch, getState) => {
    dispatch(routerActions.clearQueryParams())
  },
  
}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  prefix,
  sideEffects,
})

export { actions, reducer }
export default actions