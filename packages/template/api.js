const Api = ({
  options,
}) => {

  const getUrl = (path, type = 'api') => `${options.nocodeApiHostname}/builder/${type}/${options.websiteId}${path}`
  const getApiUrl = (path) => `${options.nocodeApiHostname}/api/v1${path}`
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