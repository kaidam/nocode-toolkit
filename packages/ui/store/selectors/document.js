import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'

import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

import contentSelectors from './content'
import uiSelectors from './ui'

const settings = contentSelectors.contentItem('settings')

const NETWORK_NAMES = networkProps('document', [
  'editLayout',
  'saveContent',
])

const layoutId = createSelector(
  settings,
  core.router.route,
  contentSelectors.contentAll,
  contentSelectors.sectionAll,
  (settings, route, content, sections) => {
    const page = content[route.item]
    if(!page) return 'default'

    const section = page.location && page.location.type == 'section' ?
      sections[page.location.id] :
      null
    const settingsId = settings && settings.data && settings.data.template && settings.data.template != 'default' ?
      settings.data.template :
      null
    const sectionId = section && section.annotation && section.annotation.template && section.annotation.template != 'default' ?
      section.annotation.template :
      null
    const pageId = page && page.annotation && page.annotation.template && page.annotation.template != 'default' ?
      page.annotation.template :
      null

    if(pageId) {
      return {
        type: 'page',
        id: pageId,
      }
    }
    else if(sectionId) {
      return {
        type: 'section',
        id: sectionId,
      }
    }
    else if(settingsId) {
      return {
        type: 'settings',
        id: settingsId,
      }
    }
    else {
      return {
        type: 'default',
        id: 'default',
      }
    }
  }
)

const layout = createSelector(
  layoutId,
  uiSelectors.templates,
  (selectedTemplate, templates) => {
    let template = templates.find(template => template.id == selectedTemplate.id)
    if(!template) {
      console.error(`warning - no template found for ${selectedTemplate.type} -> ${selectedTemplate.id}`)
      template = templates.find(template => template.id == 'default')
    }
    return template.layout
  }
)

const data = createSelector(
  core.nocode.externals,
  core.router.route,
  contentSelectors.contentAll,
  layout,
  (externals, route, content, layout) => {
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
        externals: [],
        disableLayoutEditor: true,
        defaultHome: true,
      } : {
        item,
        externals: (route.externals || []).map(id => externals[id]),
      }

    data.layout = data.item.annotation && data.item.annotation.layout ?
      data.item.annotation.layout :
      layout

    return data
  },
)

const selectors = {
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
  data,
}

export default selectors