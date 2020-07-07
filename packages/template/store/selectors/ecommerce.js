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

const purchasedProductId = state => state.ecommerce.purchasedProductId

const stripeConnectData = createSelector(
  websiteSelectors.websiteMeta,
  meta => meta.stripe,
)

const selectors = {
  purchasedProductId,
  stripeConnectData,
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
}

export default selectors