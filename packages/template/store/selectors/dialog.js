import { createSelector } from 'reselect'

import routerSelectors from './router'

const dialogParams = createSelector(
  routerSelectors.params,
  (queryParams) => {
    return Object
      .keys(queryParams)
      .filter(field => field.indexOf(`dialog_`) == 0)
      .map(field => {
        const value = queryParams[field]
        const [ _, dialog, ...nameParts ] = field.split('_')
        return {
          dialog,
          name: nameParts.join('_'),
          value,
        }
      })
      .reduce((all, item) => {
        const dialogParams = all[item.dialog] || {}
        dialogParams[item.name] = item.value
        all[item.dialog] = dialogParams
        return all
      }, {})
  }
)

const selectors = {
  dialogParams,
}

export default selectors
