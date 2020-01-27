import core from '@nocode-toolkit/website/selectors'
import network from './network'
import types from './types'
import job from './job'
import content from './content'
import finder from './finder'
import document from './document'
import section from './section'
import ui from './ui'
import fileupload from './fileupload'
import search from './search'

import {
  DEFAULT_ARRAY,
  DEFAULT_OBJECT,
} from './utils'

const selectors = {
  router: core.router,
  nocode: core.nocode,
  network,
  types,
  job,
  content,
  finder,
  document,
  section,
  ui,
  fileupload,
  search,
  DEFAULT_ARRAY,
  DEFAULT_OBJECT,
}

export default selectors