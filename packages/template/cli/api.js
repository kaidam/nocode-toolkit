const Api = ({
  options,
}) => {

  
  const getApiUrl = (path) => `${options.nocodeApiHostname}/api/v1${path}`
  const getUrl = (path) => getApiUrl(path)
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${options.accessToken}`
    }
  }

  return {
    getUrl,
    getApiUrl,
    getAuthHeaders,
  }
}

module.exports = Api