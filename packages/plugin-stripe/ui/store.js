import axios from 'axios'
// import Promise from 'bluebird'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'
// import selectors from '@nocode-toolkit/website/selectors'
// import routerActions from '@nocode-toolkit/website/store/moduleRouter'
import actionLoader from '@nocode-toolkit/ui/store/actionLoader'

const initialState = {

}

const prefix = 'stripe'

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

  purchase: (content) => async (dispatch, getState) => {
    try {
      const systemConfig = getState().nocode.config
      const keyData = await axios.get(`/plugin/stripe/publicKey`)
        .then(res => res.data)
      const publicKey = keyData.publicKey
      const line_items = [{
        name: content.name,
        description: content.description,
        quantity: 1,
        amount: content.price * 100,
        currency: content.currency.toLowerCase(),
      }]

      const success_url = document.location.search ? 
        document.location.href.replace(document.location.search, `?trigger=stripe_success&product_name=${encodeURIComponent(content.name)}`) :
        document.location.href + `?trigger=stripe_success&product_name=${encodeURIComponent(content.name)}`

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

  // upon returning from a stripe connect session
  // we want to open the settings window and alert the user
  // their stripe account is now connected
  initialize: () => async (dispatch, getState) => {
    const params = getState().router.route.params
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