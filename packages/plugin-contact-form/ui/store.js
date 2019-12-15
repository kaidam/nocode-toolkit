import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'
import actionLoader from '@nocode-toolkit/ui/store/actionLoader'

import selectors from './selectors'

const initialState = {
  contactFormOpenId: null,
}

const prefix = 'contactform'

const reducers = {
  
}

const sideEffects = {
  
  submit: () => async (dispatch, getState) => {
    try {
      const apiUrl = selectors.apiUrl(getState())
      const payload = {
        hello: 10,
      }
      const data = await axios.post(`${apiUrl}/submit`, payload)
        .then(res => res.data)
      console.log('--------------------------------------------')
      console.log('--------------------------------------------')
      console.dir(data)
      const setSuccess = actionLoader('snackbar', 'setSuccess')
      dispatch(setSuccess(`Message sent`))
    } catch(e) {
      alert('there was an error: ' + e.toString())
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