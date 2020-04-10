import globals from '../../utils/globals'
import importPromises from '../importer'

const NULL_ACTION = () => ({
  type: 'NULL_ACTION',
})

const actionLoader = (moduleName, method) => {
  if(!globals.isUIActivated()) return NULL_ACTION
  return (payload) => async (dispatch, getState) => {
    const loadedModule = await importPromises[moduleName]
    if(!loadedModule) throw new Error(`no module fund ${moduleName}`)
    const actions = loadedModule.default
    const actionMethod = actions[method]
    if(!actionMethod) throw new Error(`unknown action: ${moduleName} ${method}`)
    dispatch(actionMethod(payload))
  }
}

export default actionLoader
