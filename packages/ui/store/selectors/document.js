import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'

import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

import {
  DEFAULT_HOME,
} from '../../config'

import contentSelectors from './content'

const NETWORK_NAMES = networkProps('document', [
  'editLayout',
  'saveContent',
])

const data = createSelector(
  core.nocode.externals,
  core.router.route,
  contentSelectors.contentAll,
  (externals, route, content) => {
    const item = content[route.item]
    if(!item) {
      return {
        item: {
          data: {
            name: 'notfound',
          }
        },
        externals: [],
        layout: [],
        disableLayoutEditor: true,
      }
    }

    const data = item.type == 'defaultHome' ?
      {
        item: {
          data: {
            name: 'Home',
          }
        },
        externals: [DEFAULT_HOME],
        disableLayoutEditor: true,
      } : {
        item,
        externals: (route.externals || []).map(id => externals[id]),
      }

    data.layout = data.item.annotation && data.item.annotation.layout ?
      data.item.annotation.layout :
      [[{
        component: 'title',
        source: 'title',
        editor: 'external',
      }],[{
        component: 'html',
        source: 'external',
        editor: 'external',
        index: 0,
      }]]

    return data
  },
)



const selectors = {
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
  data,
}

export default selectors