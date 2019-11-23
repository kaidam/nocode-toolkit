import core from '@nocode-toolkit/website/selectors'
import network from './network'
import types from './types'
import job from './job'
import content from './content'
import finder from './finder'
import document from './document'
import ui from './ui'
import fileupload from './fileupload'

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
  ui,
  fileupload,
  DEFAULT_ARRAY,
  DEFAULT_OBJECT,
}

export default selectors