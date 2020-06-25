import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

const prefix = 'document'

const initialState = {
  cssImports: {},
}

const reducers = {
  addCssImports: (state, action) => {
    const freshImports = (action.payload || []).filter(importUrl => state.cssImports[importUrl] ? false : true)
    if(freshImports.length <= 0) {
      return
    }
    state.cssImports = freshImports.reduce((all, importString) => {
      all[importString] = true
      return all
    }, state.cssImports)
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
})

export { actions, reducer }
export default actions