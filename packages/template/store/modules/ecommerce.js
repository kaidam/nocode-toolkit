import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'

import {
  apiUrl,
  handlers,
} from '../utils/api'

import websiteSelectors from '../selectors/website'
import snackbarActions from './snackbar'
import networkActions from './network'

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
    dispatch(networkActions.setGlobalLoading(true))
    const websiteId = websiteSelectors.websiteId(getState())
    const stripe_connect_url = `${document.location.protocol}//${document.location.host}${apiUrl(`/builder/ecommerce/connect_response`)}`
    const data = await handlers.post(`/builder/${websiteId}/ecommerce/connect`, {
      stripe_connect_url,
      finalize_url: document.location.href,
    })
    document.location = data.url
  }, {
    globalLoading: false,
    errorHandler: () => dispatch(networkActions.setGlobalLoading(false))
  }),

  // for purchase we create the line item,
  // calculate the redirect URL for success
  // post to the session endpoint to get our session id
  // use the Stripe library to redirect to the session
  //
  // the redirect URL will trigger the confirmation window
  purchase: ({
    id,
    name,
    description,
    price,
    currency,
  }) => wrapper('purchase', async (dispatch, getState) => {
    dispatch(networkActions.setGlobalLoading(true))
    const websiteId = websiteSelectors.websiteId(getState())
    const { publicKey } = await handlers.get(`/builder/ecommerce/public_key`)
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
    
    const session_data = await handlers.post(`/builder/${websiteId}/ecommerce/session`, {
      line_items,
      success_url,
      cancel_url,
    })

    const stripe = Stripe(publicKey)

    stripe.redirectToCheckout({
      sessionId: session_data.id
    }).then(function (result) {
      dispatch(snackbarActions.setError('there was an error: ' + result.error.message))
    })
  }, {
    globalLoading: false,
    errorHandler: () => dispatch(networkActions.setGlobalLoading(false))
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