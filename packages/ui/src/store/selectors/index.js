import core from '@nocode-toolkit/website/lib/selectors'
import network from './network'
import dialog from './dialog'
import types from './types'
import job from './job'
import content from './content'
import finder from './finder'
import document from './document'
import layout from './layout'
import fileupload from './fileupload'

import {
  DEFAULT_ARRAY,
  DEFAULT_OBJECT,
} from './utils'

const selectors = {
  router: core.router,
  nocode: core.nocode,
  network,
  dialog,
  types,
  job,
  content,
  finder,
  document,
  layout,
  fileupload,
  DEFAULT_ARRAY,
  DEFAULT_OBJECT,
}

export default selectors