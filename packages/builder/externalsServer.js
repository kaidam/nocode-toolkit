const ExternalsServer = (externals) => (req, res) => {
  const fileName = req.params[0]
  const data = externals[fileName]

  if(!data) {
    res.status(404)
    res.end(`${fileName} file not found`)
    return
  }
  res.end(data)
}

module.exports = ExternalsServer