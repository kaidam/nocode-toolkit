import axios from 'axios'
import Promise from 'bluebird'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import { fileupload as initialState } from '../initialState'
import apiUtils from '../utils/api'
import networkWrapper from '../utils/networkWrapper'
import uiActions from './ui'

const prefix = 'fileupload'

const wrapper = networkWrapper.factory(prefix)

const getUploadUrl = (getState) => apiUtils.websiteUrl(getState, `/storage/upload`)

const resetState = (state) => {
  state.inProgress = false
  state.endpoint = null
  state.error = null
  state.status = {}
  state.results = {}
}

const reducers = {

  reset: (state, action) => {
    resetState(state)
  },

  // create a upload status object for each of the files being uploaded
  startUploads: (state, action) => {

    resetState(state)
    
    const {
      group,
      files,
      method,
      url,
    } = action.payload

    state.endpoint = {
      method,
      url,
    }

    state.inProgress = true
    state.error = null

    state.status = files.reduce((all, file) => {
      all[file.name] = {
        group,
        startTime: new Date().getTime(),
        size: file.size,
        uploadedBytes: 0,
        totalBytes: 0,
        percentDone: 0,
        remainingTime: 0,
      }
      return all
    }, {})
  },

  // update the percent uploaded for a single file
  setUploadedProgress: (state, action) => {
    const {
      filename,
      values,
    } = action.payload

    const {
      loaded,
      total,
    } = values

    const percent = Math.floor((loaded / total) * 100)

    const status = state.status[filename] || {}
    
    const timeUploading = (new Date().getTime()) - status.startTime
    const timePerPercent = percent > 0 ? timeUploading / percent : 0
    const percentLeft = 100 - percent
    const timeLeft = percentLeft * timePerPercent

    status.percentDone = percent
    status.remainingTime = timeLeft
    status.uploadedBytes = loaded
    status.totalBytes = total

    state.status[filename] = status
  },

  // update the result for a single file
  setResult: (state, action) => {
    const {
      filename,
      data,
    } = action.payload

    state.results[filename] = data
  },

  setError: (state, action) => {
    state.error = action.payload
  },

  finish: (state) => {
    state.inProgress = false
  },

}

const getFileUrlQuery = (file) => {
  const params = {
    name: file.name,
    type: file.type,
    size: file.size,
  }
  return Object.keys(params).map(key => {
    return `${key}=${encodeURIComponent(params[key])}`
  }).join('&')
}

const loaders = {
  syncFiles: (getState, payload) => axios.post(apiUtils.websiteUrl(getState, `/storage/sync`), payload)
    .then(apiUtils.process),
}

const sideEffects = {
  uploadFiles: ({
    group,
    files,
  }) => wrapper('uploadFiles', async (dispatch, getState) => {

    dispatch(actions.startUploads({
      group,
      files,
    }))

    const url = getUploadUrl(getState)

    const results = await Promise.map(files, async file => apiUploader({
      url,
      file,
      onProgress: (values) => {
        dispatch(actions.setUploadedProgress({
          filename: file.name,
          values,
        }))
      },
    }))

    await dispatch(actions.reset())
    return results  
  }),

  syncFiles: ({
    driver,
    id,
  }) => wrapper('syncFiles', async (dispatch, getState) => {
    dispatch(uiActions.setLoading({
      transparent: true,
      message: `uploading image`,
    }))
    const results = await loaders.syncFiles(getState, {
      driver,
      id,
    })
    return results  
  }, {
    after: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading(false))
    }
  })
}

const apiUploader = ({
  url,
  file,
  onProgress,
}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    const eventOnProgress = (e) => {
      if (e.lengthComputable) {
        onProgress(e)
      }
    }

    const eventOnFailure = (e) => {
      return reject(e)
    }
    
    const eventOnSuccess = (result) => {
      return resolve(result)
    }

    xhr.upload.addEventListener("progress", eventOnProgress, false)
    xhr.upload.addEventListener("error", eventOnFailure)
    xhr.upload.addEventListener("abort", eventOnFailure)

    xhr.onreadystatechange = () => {
      const { readyState, status } = xhr
      if (readyState === 4) {
        const headers = xhr.getAllResponseHeaders()

        const response = headers.indexOf('content-type: application/json') >= 0 ?
          JSON.parse(xhr.response) : 
          xhr.response

        if (status < 400) {
          eventOnSuccess(response)
        }
        else {
          const bodyMessage = response.error ?
            response.error :
            response
          eventOnFailure(`${status}: ${bodyMessage}`)
        }
      }
    }

    const queryParams = getFileUrlQuery(file)
    const seperator = url.indexOf('?') >= 0 ?
      '&' :
      '?'
    let useUrl = url + seperator + queryParams
    xhr.open('POST', useUrl, true)
    xhr.send(file)
  })
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