import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'

import {
  apiUrl,
  handlers,
} from '../utils/api'

import websiteSelectors from '../selectors/website'
import snackbarActions from './snackbar'
import uiActions from './ui'

import { ecommerce as initialState } from '../initialState'

const prefix = 'ecommerce'
const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

/*

  [{
        name: 'T-shirt',
        description: 'Comfortable cotton t-shirt',
        amount: 500,
        currency: 'gbp',
        quantity: 1,
      }],

*/

const sideEffects = {
  // request a stripe connect redirect URL from the backend
  // then send the browser off to Stripe
  connect: () => wrapper('connect', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const stripe_connect_url = `${document.location.protocol}//${document.location.host}${apiUrl(`/plugins/ecommerce/connect_response`)}`
    const data = await handlers.post(`/plugins/ecommerce/${websiteId}/connect`, {
      stripe_connect_url,
      finalize_url: document.location.href,
    })
    document.location = data.url
  }, {
    showLoading: true,
    hideLoading: false,
    hideLoadingOnError: true,
  }),

  // for purchase we create the line item,
  // calculate the redirect URL for success
  // post to the session endpoint to get our session id
  // use the Stripe library to redirect to the session
  //
  // the redirect URL will trigger the confirmation window
  // we need to get the connected id from the api
  purchase: ({
    id,
    name,
    description,
    price,
    currency,
  }) => wrapper('purchase', async (dispatch, getState) => {
    dispatch(uiActions.setLoading(true))
    const websiteId = websiteSelectors.websiteId(getState())
    const {
      publicKey,
      connectedStripeId,
    } = await handlers.get(`/plugins/ecommerce/public_key/${websiteId}`)
    const line_items = [{
      name,
      description,
      quantity: 1,
      amount: price * 100,
      currency: currency.toLowerCase(),
    }]

    const redirect_query = `?trigger=stripe_success&product_id=${id}`

    const success_url = document.location.search ? 
      document.location.href.replace(document.location.search, redirect_query) :
      document.location.href + redirect_query

    const cancel_url = document.location.search ? 
      document.location.href.replace(document.location.search, '') :
      document.location.href
    
    const session_data = await handlers.post(`/plugins/ecommerce/${websiteId}/session`, {
      line_items,
      success_url,
      cancel_url,
    })

    const stripe = Stripe(publicKey, {
      stripeAccount: connectedStripeId,
    })

    stripe.redirectToCheckout({
      sessionId: session_data.id
    }).then(function (result) {
      dispatch(snackbarActions.setError('there was an error: ' + result.error.message))
    })
  }, {
    showLoading: true,
    hideLoading: false,
    hideLoadingOnError: true,
  }),

}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  prefix,
  sideEffects,
})

export { actions, reducer }
export default actions