import { createSelector } from 'reselect'

import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

import contentSelectors from './content'

const NETWORK_NAMES = networkProps('section', [
  'editLayout',
  'saveContent',
])

const DEFAULT_ITEM = {
  data: {},
  children: [],
}

const panels = () => createSelector(
  contentSelectors.sectionAll,
  (_, name) => name,
  (sections, name) => {
    const sectionItem = sections[name]
    if(!sectionItem) return DEFAULT_ITEM

    const data = {
      item: sectionItem,
      externals: [],
    }
    
    data.panelTop = data.item.annotation && data.item.annotation.panelTop ?
      data.item.annotation.panelTop :
      null

    data.panelBottom = data.item.annotation && data.item.annotation.panelBottom ?
      data.item.annotation.panelBottom :
      null

    return data
  },
)

const selectors = {
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
  panels,
}

export default selectors