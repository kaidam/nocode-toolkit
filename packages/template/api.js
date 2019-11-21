const Api = ({
  options,
}) => {

  const getUrl = (path, type = 'api') => `${options.nocodeApiHostname}/builder/${type}/${options.websiteId}${path}`
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${options.accessToken}`
    }
  }

  return {
    getUrl,
    getAuthHeaders,
  }
}

module.exports = Api