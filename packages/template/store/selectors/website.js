import { createSelector } from 'reselect'
import {
  networkGroup,
} from './utils'

import systemSelectors from './system'

const DEFAULT_OBJECT = {}

const websites = state => state.website.websites
const config = state => state.website.config
const template = state => state.website.template
const dnsInfo = state => state.website.dnsInfo
const routerParams = state => state.router.route.params
const nocode = state => state.nocode

// works for both builder and frontend
// in builder mode we ask if there is nocode data inject
// and pluck the id from that
// otherwise we ask the router for an id prop
const websiteId = createSelector(
  routerParams,
  nocode,
  (params, nocodeState) => {
    // this means we are in the builder
    if(nocodeState) {
      return nocodeState.config.websiteId
    }
    else {
      return params.id
    }
  }
)

const websiteData = createSelector(
  websiteId,
  websites,
  (id, websites) => {
    if(!id) return null
    if(id == 'new') {
      return {
        name: '',
      }
    }
    else {
      return websites.find(w => w.id == id)
    }
  }
)

const websiteMeta = createSelector(
  websiteData,
  (data) => data && data.meta ? data.meta : DEFAULT_OBJECT
)

const websiteList = createSelector(
  websites,
  (websites) => {
    const list = [].concat(websites)
    list.sort((a, b) => {
      const aLevel = a.product ? parseInt(a.product.metadata.level) : 0
      const bLevel = b.product ? parseInt(b.product.metadata.level) : 0
      const aCollab = a.collaboration_type == 'owner' ? 1 : 0
      const bCollab = b.collaboration_type == 'owner' ? 1 : 0
      if(aCollab > bCollab) return -1
      else if(bCollab > aCollab) return 1
      else {
        if(aLevel > bLevel) return -1
        else if(bLevel > aLevel) return 1
        else return 0
      }
    })
    return list
  }
)

const ownedWebsiteList = createSelector(
  websiteList,
  websites => websites.filter(w => w.collaboration_type == 'owner'),
)

const settings = createSelector(
  websiteMeta,
  meta => meta.settings || DEFAULT_OBJECT,
)

const templateMeta = createSelector(
  template,
  template => {
    if(!template || !template.templateVersion || !template.templateVersion.meta) return {}
    return template.templateVersion.meta
  }
)

const settingsSchema = createSelector(
  templateMeta,
  templateMeta => templateMeta.settings || DEFAULT_OBJECT
)

const templateLayouts = createSelector(
  settingsSchema,
  settingsSchema => settingsSchema.layout || DEFAULT_OBJECT
)

const onboardingActive = createSelector(
  systemSelectors.showUI,
  systemSelectors.userMeta,
  websiteMeta,
  template,
  (showUI, userMeta, websiteMeta, template) => {
    if(!showUI) return false
    if(!template) return false
    const templateId = template.template.id
    if(websiteMeta.onboardingActive === false) return false
    if(userMeta.onboardedTemplates && userMeta.onboardedTemplates[templateId]) return false
    return true
  },
)

const selectors = {
  websiteId,
  websites,
  config,
  template,
  dnsInfo,
  websiteData,
  websiteMeta,
  websiteList,
  ownedWebsiteList,
  settings,
  templateMeta,
  settingsSchema,
  templateLayouts,
  onboardingActive,
  ...networkGroup('website', [
    'list',
    'get',
    'save',
    'delete',
    'openBuilder',
  ])
}

export default selectors
