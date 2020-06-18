import axios from 'axios'

const websiteUrl = (getState, path) => {
  const websiteId = getState().nocode.config.websiteId
  return [`/builder/api/${websiteId}`, path].join('/').replace(/\/+/g, '/')
}

const googleProxyUrl = (getState, url) => {
  return `${websiteUrl(getState, '/googleproxy')}?url=${encodeURIComponent(url)}`
}

const apiUrl = (path) => [`/api/v1`, path].join('/').replace(/\/+/g, '/')

// catch bad status codes and run an error handler
// otherwise return the data property of the response
const processResult = res => {
  if(res.status >= 400) return Promise.reject(`status: ${res.status}`)
  return res.data
}

// pluck an error message from the response body if present
const getErrorMessage = (error) => {
  const res = error.response
  let message = ''
  if(res && res.data) {
    message = res.data.error || res.data.message
  }
  message = message || error.toString()
  return message.replace(/^Error\: Error\:/, 'Error:')
}

const get = (path) => (getState) => axios.get(websiteUrl(getState, path))
  .then(processResult)

const post = (path) => (getState, payload) => axios.post(websiteUrl(getState, path), payload)
  .then(processResult)

const put = (path) => (getState, payload) => axios.put(websiteUrl(getState, path), payload)
  .then(processResult)

const del = (path) => (getState) => axios.delete(websiteUrl(getState, path))
  .then(processResult)

const apiUtils = {
  websiteUrl,
  apiUrl,
  googleProxyUrl,
  processResult,
  process: processResult,
  getErrorMessage,
  get,
  post,
  put,
  delete: del,
}

export default apiUtils