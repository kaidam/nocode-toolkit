import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'

import {
  apiUrl,
  handlers,
} from '../utils/api'

import routerActions from './router'

import routerSelectors from '../selectors/router'
import websiteSelectors from '../selectors/website'
import snackbarActions from './snackbar'
import networkActions from './network'

import { ecommerce as initialState } from '../initialState'

const prefix = 'ecommerce'
const wrapper = networkWrapper.factory(prefix)

const reducers = {
  setPurchasedProductId: (state, action) => {
    state.purchasedProductId = action.payload
  },
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
      finalize_url: document.location.href.replace(document.location.search, ''),
    })
    document.location = data.url
  }, {
    globalLoading: false,
  }),

  // // for purchase we create the line item,
  // // calculate the redirect URL for success
  // // post to the session endpoint to get our session id
  // // use the Stripe library to redirect to the session
  // //
  // // the redirect URL will trigger the confirmation window
  // purchase: ({
  //   id,
  //   name,
  //   description,
  //   price,
  //   currency,
  // }) => async (dispatch, getState) => {
  //   try {
  //     const apiUrl = selectors.apiUrl(getState())
  //     const keyData = await axios.get(`${apiUrl}/publicKey`)
  //       .then(res => res.data)
  //     const publicKey = keyData.publicKey
  //     const line_items = [{
  //       name,
  //       description,
  //       quantity: 1,
  //       amount: price * 100,
  //       currency: currency.toLowerCase(),
  //     }]

  //     const redirect_query = `?trigger=stripe_success&product_id=${id}`

  //     const success_url = document.location.search ? 
  //       document.location.href.replace(document.location.search, redirect_query) :
  //       document.location.href + redirect_query

  //     const cancel_url = document.location.search ? 
  //       document.location.href.replace(document.location.search, '') :
  //       document.location.href
      
  //     const session_data = await axios.post(`${apiUrl}/session`, {
  //       line_items,
  //       success_url,
  //       cancel_url,
  //     })
  //       .then(res => res.data)

  //     var stripe = Stripe(publicKey)

  //     stripe.redirectToCheckout({
  //       sessionId: session_data.id
  //     }).then(function (result) {
  //       dispatch(snackbarActions.setError('there was an error: ' + result.error.message))
  //     })
  //   } catch(e) {
  //     dispatch(snackbarActions.setError('there was an error: ' + e.toString()))
  //   }
  // },

  // initialize: () => async (dispatch, getState) => {
  //   const params = selectors.router.queryParams(getState())
  //   const route = selectors.router.route(getState())

  //   // upon returning from a stripe connect session
  //   // we want to open the settings window and alert the user
  //   // their stripe account is now connected
  //   if(params.trigger == 'stripe_connect') {
  //     dispatch(routerActions.navigateTo(route.name, {
  //       dialog_settings_panel: 'plugins',
  //       dialog_settings_open: 'yes',
  //       dialog_settings_tab: 'stripe',
  //     }))
  //     dispatch(snackbarActions.setSuccess(`Your stripe account is now connected`))
  //   }
  //   // once a product is purchased - we want to show a confirmation window
  //   // the product_id is the row-cell index that a button will
  //   // identify as it's own and display the confirmation
  //   // we always redirect back to the same page so expect
  //   // these indexes to remain constant between clicking the stripe
  //   // button and returning back to the page
  //   else if(params.trigger == 'stripe_success') {
  //     const productId = params.product_id
  //     dispatch(actions.setPurchasedProductId(productId))
  //   }
  // },

  // closeConfirmationWindow: () => async (dispatch, getState) => {
  //   const route = selectors.router.route(getState())
  //   dispatch(actions.setPurchasedProductId(null))
  //   dispatch(routerActions.navigateTo(route.name))
  // },
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