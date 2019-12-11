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

const sideEffects = {
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