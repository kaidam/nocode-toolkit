import { createSelector } from 'reselect'
import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

import websiteSelectors from './website'

const NETWORK_NAMES = networkProps('ecommerce', [
  'connect',
  'purchase',
])

const stripeConnectData = createSelector(
  websiteSelectors.websiteMeta,
  meta => meta.stripe,
)

const selectors = {
  stripeConnectData,
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
}

export default selectors