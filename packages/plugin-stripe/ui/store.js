import axios from 'axios'
// import Promise from 'bluebird'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'
// import selectors from '@nocode-toolkit/website/selectors'
// import routerActions from '@nocode-toolkit/website/store/moduleRouter'
import actionLoader from '@nocode-toolkit/ui/store/actionLoader'

const initialState = {
  purchasedProductId: null,
}

const prefix = 'stripe'

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
  connect: () => async (dispatch, getState) => {
    try {
      const systemConfig = getState().nocode.config
      const payload = {
        stripe_connect_url: `${document.location.protocol}//${document.location.host}/plugin/stripe/connect_response`,
        finalize_url: document.location.href.replace(document.location.search, ''),
      }
      const data = await axios.post(`/plugin/stripe/connect/${systemConfig.websiteId}`, payload)
        .then(res => res.data)
      document.location = data.url
    } catch(e) {
      alert('there was an error: ' + e.toString())
    }
  },

  purchase: ({
    id,
    name,
    description,
    price,
    currency,
  }) => async (dispatch, getState) => {
    try {
      const systemConfig = getState().nocode.config
      const keyData = await axios.get(`/plugin/stripe/publicKey`)
        .then(res => res.data)
      const publicKey = keyData.publicKey
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
      
      const session_data = await axios.post(`/plugin/stripe/session/${systemConfig.websiteId}`, {
        line_items,
        success_url,
        cancel_url,
      })
        .then(res => res.data)

      var stripe = Stripe(publicKey)

      stripe.redirectToCheckout({
        sessionId: session_data.id
      }).then(function (result) {
        alert('there was an error: ' + result.error.message)
      })
    } catch(e) {
      alert('there was an error: ' + e.toString())
    }
  },

  
  initialize: () => async (dispatch, getState) => {
    const params = getState().router.route.params

    // upon returning from a stripe connect session
    // we want to open the settings window and alert the user
    // their stripe account is now connected
    if(params.trigger == 'stripe_connect') {
      const openDialog = actionLoader('ui', 'openDialogSingletonPayload')
      const setSuccess = actionLoader('snackbar', 'setSuccess')
      dispatch(openDialog({
        id: 'settings',
        type: 'settings',
        tab: 'stripe',
      }))
      dispatch(setSuccess(`Your stripe account is now connected`))
    }
    // once a product is purchased - we want to show a confirmation window
    // the product_id is the row-cell index that a button will
    // identify as it's own and display the confirmation
    // we always redirect back to the same page so expect
    // these indexes to remain constant between clicking the stripe
    // button and returning back to the page
    else if(params.trigger == 'stripe_success') {
      const productId = params.product_id
      dispatch(actions.setPurchasedProductId(productId))
    }
  },
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